import express from "express";
import { userRoutes } from "../modules/UserProfile/userProfile.route";
import { registrationRoutes } from "../modules/Registration/registration.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { tripRoutes } from "../modules/Trip/trip.route";
import { sendRequestRoutes } from "../modules/SendRequest/sendRequest.route";
import { tripBuddyRoutes } from "../modules/TripBuddy/tripBuddy.route";

const router = express.Router();

// Define routes for each module
const moduleRoutes = [
	{
		path: "/users",
		route: userRoutes,
	},
	{
		path: "/register",
		route: registrationRoutes,
	},
	{
		path: "/auth",
		route: authRoutes,
	},
	{
		path: "/trips",
		route: tripRoutes,
	},
	{
		path: "/trip",
		route: sendRequestRoutes,
	},
	{
		path: "/travel-buddies",
		route: tripBuddyRoutes,
	},
];

// Mount routes for each module
moduleRoutes.forEach((rt) => router.use(rt.path, rt.route));

export default router;
