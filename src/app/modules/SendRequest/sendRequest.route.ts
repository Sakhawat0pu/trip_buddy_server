import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { sendRequestValidations } from "./sendRequest.validation";
import { sendRequestController } from "./sendRequest.controller";
import { UserRole } from "@prisma/client";

// POST endpoint for sending a travel request
const router = express.Router();
router.post(
	"/:tripId/request",
	auth(UserRole.TRAVELER),
	validateRequest(sendRequestValidations.sendTravelRequest),
	sendRequestController.sendTravelRequest
);

export const sendRequestRoutes = router;
