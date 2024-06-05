"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const auth_utils_1 = require("../modules/Auth/auth.utils");
// Middleware function for authentication
const auth = (...requiredRoles) => {
    // Return an async middleware function
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract token from request headers
        const token = req.headers.authorization;
        // Check if token exists
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized user");
        }
        // Verify the token
        const decoded = auth_utils_1.jwtHelpers.verifyToken(token, config_1.default.jwt_access_secret);
        const { id, role } = decoded;
        // Retrieve user from the database using id
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: id,
            },
        });
        // If user doesn't exist, throw a not found error
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Specified user does not exist in the database");
        }
        if ((user === null || user === void 0 ? void 0 : user.status) === "DELETED") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User not found");
        }
        if ((user === null || user === void 0 ? void 0 : user.status) === "BLOCKED") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User has been blocked");
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized user");
        }
        // Attach decoded token (user information) to the request object
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
