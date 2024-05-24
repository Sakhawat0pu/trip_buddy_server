import { z } from "zod";

// Validation schema for user registration
const registrationValidationSchema = z.object({
	body: z.object({
		name: z.string({ required_error: "Name is required" }),
		email: z.string({ required_error: "Email is required" }),
		password: z.string({ required_error: "Password is required" }),
		profile: z.object({
			bio: z.string({ required_error: "Bio is required" }),
			age: z.number({ required_error: "Age is required" }),
		}),
	}),
});

export const registrationValidations = {
	registrationValidationSchema,
};
