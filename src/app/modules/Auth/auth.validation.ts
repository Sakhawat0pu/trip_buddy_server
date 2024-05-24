import { z } from "zod";

// Validation schema for login user endpoint
const loginUserValidationSchema = z.object({
	body: z.object({
		email: z.string({ required_error: "Email is required" }),
		password: z.string({ required_error: "Password is required" }),
	}),
});

// Validation schema for refreshing access token endpoint
const refreshTokenValidationSchema = z.object({
	cookies: z.object({
		refreshToken: z.string({
			required_error: "Refresh token is required",
		}),
	}),
});

// Validation schema for changing password endpoint
const changePasswordValidationSchema = z.object({
	body: z.object({
		oldPassword: z.string({ required_error: "Old password is required" }),
		newPassword: z.string({ required_error: "New password is required" }),
	}),
});

export const authValidation = {
	loginUserValidationSchema,
	refreshTokenValidationSchema,
	changePasswordValidationSchema,
};
