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
exports.userServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
/**
 * Retrieves user profile information from the database based on the user's JWT payload.
 * @param userInfo The JWT payload containing user information.
 * @returns A promise that resolves to the user profile information.
 */
const getMeFromDb = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user in the database based on the user ID from the JWT payload
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userInfo.id,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            role: true,
            userProfile: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            userProfile: true,
        },
    });
    return result;
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            userProfile: true,
        },
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Specified user not found!");
    }
    return result;
});
/**
 * Updates user profile information in the database based on the user's JWT payload and the provided payload.
 * @param userInfo The JWT payload containing user information.
 * @param payload The payload containing updated user profile information.
 * @returns A promise that resolves to the updated user profile information.
 */
const updateMeIntoDb = (userInfo, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Find the user in the database based on the user ID from the JWT payload
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            id: userInfo.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    if (payload === null || payload === void 0 ? void 0 : payload.email) {
        const userExistWithTheProvidedEmail = yield prisma_1.default.user.findUnique({
            where: {
                email: payload.email,
            },
        });
        if (userExistWithTheProvidedEmail) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User already exists with the provided email!");
        }
    }
    const profileData = {
        age: (_a = payload === null || payload === void 0 ? void 0 : payload.profile) === null || _a === void 0 ? void 0 : _a.age,
        bio: (_b = payload === null || payload === void 0 ? void 0 : payload.profile) === null || _b === void 0 ? void 0 : _b.bio,
    };
    const result = yield prisma_1.default.$transaction((client) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUserProfile = yield client.userProfile.update({
            where: {
                userId: userData.id,
            },
            data: profileData,
        });
        const updatedUserInfo = yield client.user.update({
            where: {
                id: userData.id,
            },
            data: { name: payload === null || payload === void 0 ? void 0 : payload.name, email: payload === null || payload === void 0 ? void 0 : payload.email },
            select: {
                id: true,
                name: true,
                email: true,
                userProfile: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedUserInfo;
    }));
    return result;
});
const updateUserRoleIntoDb = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.update({
        where: {
            id: userId,
            status: client_1.UserStatus.ACTIVE,
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            role: true,
            userProfile: true,
        },
    });
    return userData;
});
const updateUserStatusIntoDb = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            role: true,
            userProfile: true,
        },
    });
    return userData;
});
exports.userServices = {
    getMeFromDb,
    getAllUsers,
    getSingleUser,
    updateMeIntoDb,
    updateUserRoleIntoDb,
    updateUserStatusIntoDb,
};
