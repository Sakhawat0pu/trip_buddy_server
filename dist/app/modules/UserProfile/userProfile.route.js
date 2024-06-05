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
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// GET endpoint to get user profile
router.get("/me", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.TRAVELER), userProfile_controller_1.userControllers.getMe);
// GET endpoint to get all the users
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), userProfile_controller_1.userControllers.getAllUsers);
// GET endpoint to get a user by ID
router.get("/:userId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), userProfile_controller_1.userControllers.getSingleUser);
// PATCH endpoint to update user profile
router.patch("/update-me", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.TRAVELER), (0, validateRequest_1.default)(userProfile_validation_1.userValidations.updateProfileValidationSchema), userProfile_controller_1.userControllers.updateMe);
router.patch("/role/:userId/edit", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(userProfile_validation_1.userValidations.updateRoleValidationSchema), userProfile_controller_1.userControllers.updateUserRole);
router.patch("/status/:userId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(userProfile_validation_1.userValidations.updateStatusValidationSchema), userProfile_controller_1.userControllers.updateUserStatus);
exports.userRoutes = router;
