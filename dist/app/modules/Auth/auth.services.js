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
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload === null || payload === void 0 ? void 0 : payload.email,
        },
    });
    if (!(yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Incorrect Password, please provide the right password.");
    }
    const jwtPayload = {
        id: user.id,
        email: user.email,
    };
    const accessToken = auth_utils_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_token_expires_in);
    const refreshToken = auth_utils_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_token_expires_in);
    const loginData = {
        id: user.id,
        name: user.name,
        email: user.email,
        token: accessToken,
    };
    return {
        loginData,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = auth_utils_1.jwtHelpers.verifyToken(token, config_1.default.jwt_refresh_secret);
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized user");
    }
    const { email, id } = decoded;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const jwtPayload = {
        id,
        email,
    };
    const accessToken = auth_utils_1.jwtHelpers.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_token_expires_in);
    return { accessToken };
});
const changePasswordFromDb = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    const passwordMatched = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.oldPassword, userInfo.password);
    if (!passwordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password did not matched");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_round));
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
exports.authServices = {
    loginUser,
    refreshToken,
    changePasswordFromDb,
};
