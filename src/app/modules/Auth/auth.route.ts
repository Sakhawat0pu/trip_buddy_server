import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
	"/login",
	validateRequest(authValidation.loginUserValidationSchema),
	authController.loginUser
);

router.post(
	"/refresh-token",
	validateRequest(authValidation.refreshTokenValidationSchema),
	authController.refreshToken
);

router.post(
	"/change-password",
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
	validateRequest(authValidation.changePasswordValidationSchema),
	authController.changePassword
);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;
