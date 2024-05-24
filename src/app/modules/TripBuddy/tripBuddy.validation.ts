import { RequestStatus } from "@prisma/client";
import { z } from "zod";

// Zod validation schema for responding to a buddy request
const respondBuddyRequestValidationSchema = z.object({
	body: z.object({
		tripId: z.string({ required_error: "Trip id is required." }),
		status: z.enum([
			RequestStatus.APPROVED,
			RequestStatus.PENDING,
			RequestStatus.REJECTED,
		]),
	}),
});

export const tripBuddyValidations = {
	respondBuddyRequestValidationSchema,
};
