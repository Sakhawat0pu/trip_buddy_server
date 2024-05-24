"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required" }).optional(),
        email: zod_1.z.string({ required_error: "Email is required" }).optional(),
        password: zod_1.z.undefined({
            invalid_type_error: "Password filed is not allowed in profile update",
        }),
    }),
});
exports.userValidations = {
    updateProfileValidationSchema,
};
