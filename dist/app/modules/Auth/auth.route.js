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
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(auth_validation_1.authValidation.loginUserValidationSchema), auth_controller_1.authController.loginUser);
// router.post(
// 	"/refresh-token",
// 	validateRequest(authValidation.refreshTokenValidationSchema),
// 	authController.refreshToken
// );
// router.post(
// 	"/change-password",
// 	auth(),
// 	validateRequest(authValidation.changePasswordValidationSchema),
// 	authController.changePassword
// );
exports.authRoutes = router;
