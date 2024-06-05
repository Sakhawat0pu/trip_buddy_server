"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.authValidation.loginUserValidationSchema), auth_controller_1.authController.loginUser);
router.post("/refresh-token", (0, validateRequest_1.default)(auth_validation_1.authValidation.refreshTokenValidationSchema), auth_controller_1.authController.refreshToken);
router.post("/change-password", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.TRAVELER), (0, validateRequest_1.default)(auth_validation_1.authValidation.changePasswordValidationSchema), auth_controller_1.authController.changePassword);
router.post("/forgot-password", auth_controller_1.authController.forgotPassword);
router.post("/reset-password", auth_controller_1.authController.resetPassword);
exports.authRoutes = router;
