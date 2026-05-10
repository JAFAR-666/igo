import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { adminLoginController, onboardWorkerController, requestOtpController, switchModeController, verifyOtpController } from "../controllers/auth.controller.js";
import { listCategoriesController } from "../controllers/catalog.controller.js";
import { createBookingController, getBookingController, listCustomerBookingsController, listWorkerBookingsController, updateBookingStatusController, updateWorkerLocationController, verifyBookingStartOtpController } from "../controllers/booking.controller.js";
import { getWorkerDashboardController, getWorkerProfileController, listWorkersController, updateAvailabilityController } from "../controllers/worker.controller.js";
import { capturePaymentController } from "../controllers/payment.controller.js";
import { createReviewController } from "../controllers/review.controller.js";
import { getAdminDashboardController, updateWageRangeController, verifyWorkerController } from "../controllers/admin.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", app: "igo-api" });
});

apiRouter.post("/auth/request-otp", asyncHandler(requestOtpController));
apiRouter.post("/auth/verify-otp", asyncHandler(verifyOtpController));
apiRouter.post("/auth/admin-login", asyncHandler(adminLoginController));
apiRouter.post("/auth/switch-mode", requireAuth, asyncHandler(switchModeController));
apiRouter.post("/worker/onboarding", requireAuth, asyncHandler(onboardWorkerController));

apiRouter.get("/categories", asyncHandler(listCategoriesController));
apiRouter.get("/workers", asyncHandler(listWorkersController));
apiRouter.get("/workers/:workerId", asyncHandler(getWorkerProfileController));
apiRouter.patch("/workers/availability", requireAuth, asyncHandler(updateAvailabilityController));
apiRouter.get("/workers/dashboard/me", requireAuth, asyncHandler(getWorkerDashboardController));

apiRouter.post("/bookings", requireAuth, asyncHandler(createBookingController));
apiRouter.get("/bookings/me", requireAuth, asyncHandler(listCustomerBookingsController));
apiRouter.get("/worker/bookings/me", requireAuth, asyncHandler(listWorkerBookingsController));
apiRouter.get("/bookings/:bookingId", requireAuth, asyncHandler(getBookingController));
apiRouter.patch("/bookings/:bookingId/status", requireAuth, asyncHandler(updateBookingStatusController));
apiRouter.post("/bookings/:bookingId/verify-start-otp", requireAuth, asyncHandler(verifyBookingStartOtpController));
apiRouter.post("/tracking/location", requireAuth, asyncHandler(updateWorkerLocationController));

apiRouter.post("/payments/capture", requireAuth, asyncHandler(capturePaymentController));
apiRouter.post("/reviews", requireAuth, asyncHandler(createReviewController));

apiRouter.get("/admin/dashboard", requireAuth, requireAdmin, asyncHandler(getAdminDashboardController));
apiRouter.patch("/admin/workers/:workerId/verification", requireAuth, requireAdmin, asyncHandler(verifyWorkerController));
apiRouter.patch("/admin/wage-ranges", requireAuth, requireAdmin, asyncHandler(updateWageRangeController));
