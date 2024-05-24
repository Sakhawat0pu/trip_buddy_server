import { UserRole } from "@prisma/client";
import { z } from "zod";

// Define the schema for updating user profile
const updateProfileValidationSchema = z.object({
	body: z.object({
		name: z.string().optional(),
		email: z.string().optional(),
		profile: z
			.object({
				bio: z.string().optional(),
				age: z.number().optional(),
			})
			.optional(),
		password: z.undefined({
			invalid_type_error: "Password filed is not allowed in profile update",
		}),
	}),
});

const updateRoleValidationSchema = z.object({
	body: z.object({
		role: z.enum([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TRAVELER]),
	}),
});

export const userValidations = {
	updateProfileValidationSchema,
	updateRoleValidationSchema,
};
