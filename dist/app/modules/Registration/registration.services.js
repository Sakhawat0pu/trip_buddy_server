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
exports.registrationServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const client_1 = require("@prisma/client");
// Service function for registering a user into the database
const registerUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Hash the user's password
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, Number(config_1.default.bcrypt_salt_round));
    const userData = {
        name: payload.name,
        email: payload.email,
        role: (payload === null || payload === void 0 ? void 0 : payload.role) || client_1.UserRole.TRAVELER,
        password: hashedPassword,
    };
    // Perform a transaction to create user and user profile records atomically
    const result = yield prisma_1.default.$transaction((client) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        // Create user record
        const createdUserData = yield client.user.create({
            data: userData,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        // Create user profile record if profile data is provided
        yield client.userProfile.create({
            data: {
                userId: createdUserData.id,
                bio: (_a = payload === null || payload === void 0 ? void 0 : payload.profile) === null || _a === void 0 ? void 0 : _a.bio,
                age: (_b = payload === null || payload === void 0 ? void 0 : payload.profile) === null || _b === void 0 ? void 0 : _b.age,
            },
        });
        return createdUserData;
    }));
    return result;
});
exports.registrationServices = {
    registerUserIntoDb,
};
