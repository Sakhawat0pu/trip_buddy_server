import express, { NextFunction, Request } from "express";
import { userControllers } from "./userProfile.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./userProfile.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// GET endpoint to get user profile
router.get(
	"/me",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TRAVELER),
	userControllers.getMe
);

// GET endpoint to get all the users
router.get(
	"/",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	userControllers.getAllUsers
);

// GET endpoint to get a user by ID
router.get(
	"/:userId",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	userControllers.getSingleUser
);

// PATCH endpoint to update user profile
router.patch(
	"/update-me",
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

router.patch(
	"/status/:userId",
	auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
	validateRequest(userValidations.updateStatusValidationSchema),
	userControllers.updateUserStatus
);

export const userRoutes = router;
