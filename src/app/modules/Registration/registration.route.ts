import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { registrationValidations } from "./registration.validation";
import { registrationControllers } from "./registration.controller";

const router = express.Router();

// POST endpoint for user registration
router.post(
	"/",
	validateRequest(registrationValidations.registrationValidationSchema),
	registrationControllers.registerUser
);

export const registrationRoutes = router;
