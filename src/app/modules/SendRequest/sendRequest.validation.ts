import { z } from "zod";

// Validation schema for sending a travel request
const sendTravelRequest = z.object({
	body: z.object({
		userId: z.string({ required_error: "User id is required" }),
	}),
});

export const sendRequestValidations = {
	sendTravelRequest,
};
