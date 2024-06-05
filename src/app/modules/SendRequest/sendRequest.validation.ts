import { z } from "zod";

// Validation schema for sending a travel request
const sendTravelRequest = z.object({
	body: z.object({
		requesterName: z.string({ required_error: "Requester name is required" }),
		requesterContactNo: z.string({
			required_error: "Requester name is required",
		}),
		requesterEmail: z.string({ required_error: "Requester name is required" }),
		requesterAccomPreference: z.string().optional(),
		message: z.string().optional(),
	}),
});

export const sendRequestValidations = {
	sendTravelRequest,
};
