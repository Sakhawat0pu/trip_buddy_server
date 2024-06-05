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
exports.authServices = void 0;
const auth_utils_1 = require("./auth.utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const client_1 = require("@prisma/client");
const sendEmail_1 = require("../../utils/sendEmail");
// Service function for user login
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload === null || payload === void 0 ? void 0 : payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    // Compare hashed password with provided password
    if (!(yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Incorrect Password, please provide the right password.");
    }
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    // Create access token and refresh token
    const accessToken = auth_utils_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_token_expires_in);
    const refreshToken = auth_utils_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_token_expires_in);
    const loginData = {
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken: accessToken,
    };
    return {
        loginData,
        refreshToken,
    };
});
// Service function for refreshing access token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = auth_utils_1.jwtHelpers.verifyToken(token, config_1.default.jwt_refresh_secret);
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized user");
    }
    const { id } = decoded;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = auth_utils_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_token_expires_in);
    return { accessToken };
});
// Service function for changing user password
const changePasswordFromDb = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userInfo) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    // Compare old password with the hashed password in the database
    const passwordMatched = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.oldPassword, userInfo.password);
    if (!passwordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password did not matched");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    // Update user password in the database
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
        },
        data: {
            password: newHashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload === null || payload === void 0 ? void 0 : payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const jwtPayload = {
        id: userInfo.id,
        email: userInfo.email,
        role: userInfo.role,
    };
    const resetToken = auth_utils_1.jwtHelpers.createToken(jwtPayload, config_1.default.reset_password_secret, config_1.default.reset_password_token_expires_in);
    const reset_pass_link = `${config_1.default.frontend_base_uri}/reset-password?userId=${userInfo.id}&token=${resetToken}`;
    const resetHtml = `
		<div>
			<p>
				Dear User,<br>
				We received a request to reset the password for your account. If you initiated this request, please follow the instructions below to reset your password.<br>
		Please click the link below:
			</p>
			<p>
				Click here, <a href=${reset_pass_link}>password reset link</a>
			</p>
		</div>
	`;
    yield (0, sendEmail_1.sendEmail)(userInfo.email, resetHtml);
    return null;
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload === null || payload === void 0 ? void 0 : payload.userId,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized user");
    }
    const decoded = auth_utils_1.jwtHelpers.verifyToken(token, config_1.default.reset_password_secret);
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Reset token is not valid");
    }
    const { email } = decoded;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Reset token is not valid");
    }
    if (userInfo.id !== user.id) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Reset token is not valid");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_round));
    const updatedDate = yield prisma_1.default.user.update({
        where: {
            id: payload === null || payload === void 0 ? void 0 : payload.userId,
        },
        data: {
            password: hashedPassword,
        },
        select: {
            email: true,
        },
    });
    return updatedDate;
});
exports.authServices = {
    loginUser,
    refreshToken,
    changePasswordFromDb,
    forgotPassword,
    resetPassword,
};
