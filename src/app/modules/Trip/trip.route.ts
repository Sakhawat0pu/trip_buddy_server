import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { tripValidation } from "./trip.validation";
import { tripController } from "./trip.controller";
import { UserRole } from "@prisma/client";
import { upload } from "../../utils/uploadImageToCloudinary";

const router = express.Router();

// GET endpoint for retrieving all trips
router.get(
	"/",
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
	tripController.getAllTrips
);

// GET endpoint for retrieving a trip by id
router.get(
	"/:tripId",
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
	tripController.getSingleTrip
);

// GET endpoint to get all the requested trip for the logged in user
router.get(
	"/my-requested-trips",
	auth(UserRole.TRAVELER),
	tripController.getAllMyRequestedTrips
);

// GET endpoint to get all the posted trips for the logged in user
router.get(
	"/my-posted-trips",
	auth(UserRole.TRAVELER),
	tripController.getAllMyPostedTrips
);

// POST endpoint for creating a new trip
router.post(
	"/",
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
	upload.array("files", 10),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = JSON.parse(req.body.data);
		next();
	},
	validateRequest(tripValidation.createTripValidationSchema),
	tripController.createTrip
);

router.delete(
	"/:tripId",
	auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
	tripController.deleteAPost
);

export const tripRoutes = router;
