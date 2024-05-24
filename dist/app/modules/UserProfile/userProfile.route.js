"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userProfile_controller_1 = require("./userProfile.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const userProfile_validation_1 = require("./userProfile.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(), userProfile_controller_1.userControllers.getMe);
router.patch("/", (0, auth_1.default)(), (0, validateRequest_1.default)(userProfile_validation_1.userValidations.updateProfileValidationSchema), userProfile_controller_1.userControllers.updateMe);
exports.userRoutes = router;
