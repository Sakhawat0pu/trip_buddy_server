"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Define the schema for updating user profile
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        profile: zod_1.z
            .object({
            bio: zod_1.z.string().optional(),
            age: zod_1.z.number().optional(),
        })
            .optional(),
        password: zod_1.z.undefined({
            invalid_type_error: "Password filed is not allowed in profile update",
        }),
    }),
});
const updateRoleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum([client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.TRAVELER]),
    }),
});
const updateStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.BLOCKED, client_1.UserStatus.DELETED]),
    }),
});
exports.userValidations = {
    updateProfileValidationSchema,
    updateRoleValidationSchema,
    updateStatusValidationSchema,
};
