"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userProfile_route_1 = require("../modules/UserProfile/userProfile.route");
const registration_route_1 = require("../modules/Registration/registration.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const trip_route_1 = require("../modules/Trip/trip.route");
const sendRequest_route_1 = require("../modules/SendRequest/sendRequest.route");
const tripBuddy_route_1 = require("../modules/TripBuddy/tripBuddy.route");
const router = express_1.default.Router();
// Define routes for each module
const moduleRoutes = [
    {
        path: "/users",
        route: userProfile_route_1.userRoutes,
    },
    {
        path: "/register",
        route: registration_route_1.registrationRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/trips",
        route: trip_route_1.tripRoutes,
    },
    {
        path: "/trip",
        route: sendRequest_route_1.sendRequestRoutes,
    },
    {
        path: "/travel-buddies",
        route: tripBuddy_route_1.tripBuddyRoutes,
    },
];
// Mount routes for each module
moduleRoutes.forEach((rt) => router.use(rt.path, rt.route));
exports.default = router;
