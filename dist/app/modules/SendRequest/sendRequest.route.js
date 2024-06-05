"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const sendRequest_validation_1 = require("./sendRequest.validation");
const sendRequest_controller_1 = require("./sendRequest.controller");
const client_1 = require("@prisma/client");
// POST endpoint for sending a travel request
const router = express_1.default.Router();
router.post("/:tripId/request", (0, auth_1.default)(client_1.UserRole.TRAVELER), (0, validateRequest_1.default)(sendRequest_validation_1.sendRequestValidations.sendTravelRequest), sendRequest_controller_1.sendRequestController.sendTravelRequest);
exports.sendRequestRoutes = router;
