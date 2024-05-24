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
const router = express_1.default.Router();
router.get("/:tripId", (0, auth_1.default)(), tripBuddy_controller_1.tripBuddiesController.getTravelBuddiesForATrip);
router.put("/:buddyId/respond", (0, auth_1.default)(), (0, validateRequest_1.default)(tripBuddy_validation_1.tripBuddyValidations.respondBuddyRequestValidationSchema), tripBuddy_controller_1.tripBuddiesController.respondTravelBuddyRequest);
exports.tripBuddyRoutes = router;
