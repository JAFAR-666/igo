const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function issueOtp(mobile: string) {
  const otp = "123456";
  otpStore.set(mobile, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return {
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };
}

export function verifyOtp(mobile: string, otp: string) {
  const entry = otpStore.get(mobile);
  if (!entry) {
    return false;
  }
  if (entry.expiresAt < Date.now()) {
    otpStore.delete(mobile);
    return false;
  }
  const isValid = entry.otp === otp;
  if (isValid) {
    otpStore.delete(mobile);
  }
  return isValid;
}
