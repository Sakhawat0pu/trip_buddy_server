"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripBuddyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const tripBuddy_controller_1 = require("./tripBuddy.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const tripBuddy_validation_1 = require("./tripBuddy.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// GET endpoint to get potential travel buddies for a trip
router.get("/:tripId", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), tripBuddy_controller_1.tripBuddiesController.getTravelBuddiesForATrip);
// GET endpoint to get all requests to join trips posted by the logged in user
router.get("/requests-to-join", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), tripBuddy_controller_1.tripBuddiesController.getAllRequestToJoinMyTrips);
// PUT endpoint to respond to a travel buddy request
router.patch("/:buddyId/respond", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), (0, validateRequest_1.default)(tripBuddy_validation_1.tripBuddyValidations.respondBuddyRequestValidationSchema), tripBuddy_controller_1.tripBuddiesController.respondTravelBuddyRequest);
exports.tripBuddyRoutes = router;
