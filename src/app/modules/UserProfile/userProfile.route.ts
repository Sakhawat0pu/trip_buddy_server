import express from "express";
import { userControllers } from "./userProfile.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./userProfile.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// GET endpoint to get user profile
router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TRAVELER),
	userControllers.getMe
);

// PATCH endpoint to update user profile
router.patch(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TRAVELER),
	validateRequest(userValidations.updateProfileValidationSchema),
	userControllers.updateMe
);

router.patch(
	"/role/:userId/edit",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(userValidations.updateRoleValidationSchema),
	userControllers.updateUserRole
);

export const userRoutes = router;
