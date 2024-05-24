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
const router = express_1.default.Router();
router.get("/", trip_controller_1.tripController.getAllTrips);
router.post("/", (0, auth_1.default)(), (0, validateRequest_1.default)(trip_validation_1.tripValidation.createTripValidationSchema), trip_controller_1.tripController.createTrip);
exports.tripRoutes = router;
