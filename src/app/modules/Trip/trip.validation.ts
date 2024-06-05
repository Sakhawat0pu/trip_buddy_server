import { z } from "zod";

const createTripValidationSchema = z.object({
	body: z.object({
		destination: z.string({ required_error: "Destination is required" }),
		tripType: z.string({ required_error: "Trip type is required" }),
		description: z.string({ required_error: "Trip description is required" }),
		startDate: z.string({ required_error: "Trip start date is required" }),
		endDate: z.string({ required_error: "Trip end date is required" }),
		budget: z.number({ required_error: "Budget is required" }),
		activities: z.array(z.string(), {
			required_error: "Activities field is required",
		}),
	}),
});

export const tripValidation = {
	createTripValidationSchema,
};
