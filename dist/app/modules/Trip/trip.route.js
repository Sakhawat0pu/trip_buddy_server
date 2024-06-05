"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const trip_validation_1 = require("./trip.validation");
const trip_controller_1 = require("./trip.controller");
const client_1 = require("@prisma/client");
const uploadImageToCloudinary_1 = require("../../utils/uploadImageToCloudinary");
const router = express_1.default.Router();
// GET endpoint for retrieving all trips
router.get("/", trip_controller_1.tripController.getAllTrips);
// GET endpoint for retrieving a trip by id
router.get("/:tripId/single-trip", 
// auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRAVELER),
trip_controller_1.tripController.getSingleTrip);
// GET endpoint to get all the requested trip for the logged in user
router.get("/my-requested-trips", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), trip_controller_1.tripController.getAllMyRequestedTrips);
// GET endpoint to get all the posted trips for the logged in user
router.get("/my-posted-trips", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), trip_controller_1.tripController.getAllMyPostedTrips);
// GET endpoint to get all the join request for posted trips for the logged in user
router.get("/join-requests", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), trip_controller_1.tripController.getAllJoinRequestsForMyPostedTrips);
// POST endpoint for creating a new trip
router.post("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), uploadImageToCloudinary_1.upload.array("files", 10), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(trip_validation_1.tripValidation.createTripValidationSchema), trip_controller_1.tripController.createTrip);
router.delete("/:tripId", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), trip_controller_1.tripController.deleteAPost);
exports.tripRoutes = router;
