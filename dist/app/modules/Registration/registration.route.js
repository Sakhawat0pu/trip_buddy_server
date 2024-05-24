"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const registration_validation_1 = require("./registration.validation");
const registration_controller_1 = require("./registration.controller");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(registration_validation_1.registrationValidations.registrationValidationSchema), registration_controller_1.registrationControllers.registerUser);
exports.registrationRoutes = router;
