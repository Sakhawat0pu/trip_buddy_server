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
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("./app/config"));
const prisma_1 = __importDefault(require("./app/shared/prisma"));
const superAdminData = {
    name: config_1.default.super_admin_name,
    email: config_1.default.super_admin_email_address,
    password: config_1.default.super_admin_password,
    role: client_1.UserRole.SUPER_ADMIN,
    status: client_1.UserStatus.ACTIVE,
};
const superAdminProfileData = {
    bio: "Exploring the world one trip at a time. Join me on Travel Buddy for unforgettable adventures and travel tips.",
    age: 25,
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    superAdminData.password = yield bcrypt_1.default.hash(superAdminData.password, Number(config_1.default.bcrypt_salt_round));
    try {
        const isSuperAdminExist = yield prisma_1.default.user.findFirst({
            where: {
                email: superAdminData.email,
                role: client_1.UserRole.SUPER_ADMIN,
            },
        });
        if (isSuperAdminExist) {
            console.log(`A super admin with email ${superAdminData.email} already exists!`);
        }
        if (!isSuperAdminExist) {
            const superAdmin = yield prisma_1.default.user.create({
                data: Object.assign(Object.assign({}, superAdminData), { userProfile: {
                        create: superAdminProfileData,
                    } }),
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                },
            });
            console.log("Super Admin created successfully!");
            console.log(superAdmin);
        }
    }
    catch (err) {
        console.log(err);
    }
    finally {
        prisma_1.default.$disconnect();
    }
});
seedSuperAdmin();
