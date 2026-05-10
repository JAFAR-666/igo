import bcrypt from "bcryptjs";
import { query, withTransaction } from "../db/pool.js";
import { signAccessToken } from "../utils/auth.js";
import { ApiError } from "../utils/errors.js";
import { issueOtp, verifyOtp } from "./otp.service.js";

type UserRow = {
  id: string;
  mobile: string;
  email: string | null;
  full_name: string;
  active_mode: "customer" | "worker";
  is_worker_enabled: boolean;
};

export async function requestOtpLogin(input: { mobile: string; fullName?: string; email?: string }) {
  const mobile = normalizeMobile(input.mobile);

  const result = await query<UserRow>(
    `
      SELECT id, mobile, email, full_name, active_mode, is_worker_enabled
      FROM users
      WHERE mobile = $1
      LIMIT 1
    `,
    [mobile]
  );

  if (result.rowCount === 0) {
    await query(
      `
        INSERT INTO users (mobile, email, full_name)
        VALUES ($1, $2, $3)
      `,
      [mobile, input.email || null, input.fullName || "igo User"]
    );
  }

  const issued = issueOtp(mobile);

  return {
    message: "OTP issued",
    mobile,
    demoOtp: issued.otp,
    expiresAt: issued.expiresAt,
  };
}

export async function verifyOtpLogin(input: {
  mobile: string;
  otp: string;
  activeMode: "customer" | "worker";
}) {
  const mobile = normalizeMobile(input.mobile);
  const isValid = verifyOtp(mobile, input.otp);
  if (!isValid) {
    throw new ApiError(401, "Invalid or expired OTP");
  }

  const result = await query<UserRow>(
    `
      SELECT id, mobile, email, full_name, active_mode, is_worker_enabled
      FROM users
      WHERE mobile = $1
      LIMIT 1
    `,
    [mobile]
  );

  const user = result.rows[0];
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (input.activeMode === "worker" && !user.is_worker_enabled) {
    throw new ApiError(403, "Complete worker onboarding to enter worker mode");
  }

  await query(`UPDATE users SET active_mode = $2, updated_at = NOW() WHERE id = $1`, [user.id, input.activeMode]);

  const accessToken = signAccessToken({
    sub: user.id,
    role: "user",
    activeMode: input.activeMode,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      fullName: user.full_name,
      activeMode: input.activeMode,
      isWorkerEnabled: user.is_worker_enabled,
    },
  };
}

export async function switchMode(userId: string, activeMode: "customer" | "worker") {
  const result = await query<UserRow>(
    `
      UPDATE users
      SET active_mode = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, mobile, email, full_name, active_mode, is_worker_enabled
    `,
    [userId, activeMode]
  );
  const user = result.rows[0];
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (activeMode === "worker" && !user.is_worker_enabled) {
    throw new ApiError(403, "Worker mode not enabled");
  }

  return {
    accessToken: signAccessToken({ sub: user.id, role: "user", activeMode }),
    user: {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      fullName: user.full_name,
      activeMode,
      isWorkerEnabled: user.is_worker_enabled,
    },
  };
}

export async function adminLogin(email: string, password: string) {
  const result = await query<{ id: string; email: string; password_hash: string; full_name: string }>(
    `
      SELECT id, email, password_hash, full_name
      FROM admin_users
      WHERE email = $1
      LIMIT 1
    `,
    [email.toLowerCase()]
  );
  const admin = result.rows[0];
  if (!admin) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    accessToken: signAccessToken({ sub: admin.id, role: "admin" }),
    admin: {
      id: admin.id,
      email: admin.email,
      fullName: admin.full_name,
    },
  };
}

export async function onboardWorker(userId: string, input: {
  bio: string;
  experienceYears: number;
  skillsText: string;
  voiceSkillsText?: string;
  languages: string[];
  latitude?: number;
  longitude?: number;
  categories: string[];
  pricing: Array<{
    categoryId: string;
    hourlyRate: number;
    halfDayRate: number;
    fullDayRate: number;
  }>;
  documents: Array<{
    documentType: string;
    documentUrl: string;
  }>;
}) {
  return withTransaction(async (client) => {
    const workerProfileResult = await client.query<{ id: string }>(
      `
        INSERT INTO worker_profiles (
          user_id, bio, experience_years, skills_text, voice_skills_text,
          languages, latitude, longitude
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (user_id) DO UPDATE SET
          bio = EXCLUDED.bio,
          experience_years = EXCLUDED.experience_years,
          skills_text = EXCLUDED.skills_text,
          voice_skills_text = EXCLUDED.voice_skills_text,
          languages = EXCLUDED.languages,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          updated_at = NOW()
        RETURNING id
      `,
      [
        userId,
        input.bio,
        input.experienceYears,
        input.skillsText,
        input.voiceSkillsText || "",
        input.languages,
        input.latitude ?? null,
        input.longitude ?? null,
      ]
    );

    const workerId = workerProfileResult.rows[0].id;

    await client.query(`DELETE FROM worker_categories WHERE worker_id = $1`, [workerId]);
    await client.query(`DELETE FROM worker_pricing WHERE worker_id = $1`, [workerId]);

    for (const categoryId of input.categories) {
      await client.query(
        `INSERT INTO worker_categories (worker_id, category_id) VALUES ($1, $2)`,
        [workerId, categoryId]
      );
    }

    for (const item of input.pricing) {
      await client.query(
        `
          INSERT INTO worker_pricing (
            worker_id, category_id, hourly_rate, half_day_rate, full_day_rate
          ) VALUES ($1, $2, $3, $4, $5)
        `,
        [workerId, item.categoryId, item.hourlyRate, item.halfDayRate, item.fullDayRate]
      );
    }

    await client.query(`DELETE FROM worker_documents WHERE worker_id = $1`, [workerId]);
    for (const document of input.documents) {
      await client.query(
        `
          INSERT INTO worker_documents (worker_id, document_type, document_url)
          VALUES ($1, $2, $3)
        `,
        [workerId, document.documentType, document.documentUrl]
      );
    }

    await client.query(
      `
        UPDATE users
        SET is_worker_enabled = TRUE, updated_at = NOW()
        WHERE id = $1
      `,
      [userId]
    );

    return { workerId };
  });
}

function normalizeMobile(mobile: string) {
  return mobile.replace(/\D/g, "");
}
