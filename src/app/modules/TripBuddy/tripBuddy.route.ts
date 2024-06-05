import express from "express";
import auth from "../../middlewares/auth";
import { tripBuddiesController } from "./tripBuddy.controller";
import validateRequest from "../../middlewares/validateRequest";
import { tripBuddyValidations } from "./tripBuddy.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// GET endpoint to get potential travel buddies for a trip
router.get(
	"/:tripId",
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
	tripBuddiesController.getTravelBuddiesForATrip
);

// GET endpoint to get all requests to join trips posted by the logged in user
router.get(
	"/requests-to-join",
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
	tripBuddiesController.getAllRequestToJoinMyTrips
);

// PUT endpoint to respond to a travel buddy request
router.patch(
	"/:buddyId/respond",
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
	validateRequest(tripBuddyValidations.respondBuddyRequestValidationSchema),
	tripBuddiesController.respondTravelBuddyRequest
);

export const tripBuddyRoutes = router;
