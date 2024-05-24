import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { tripBuddiesServices } from "./tripBuddy.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// Controller function to get potential travel buddies for a trip
const getTravelBuddiesForATrip = catchAsync(
	async (req: Request, res: Response) => {
		const tripId = req.params.tripId;
		const result =
			await tripBuddiesServices.getTravelBuddiesForATripFromDb(tripId);
		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Potential travel buddies retrieved successfully",
			data: result,
		});
	}
);

// Controller function to respond to a travel buddy request
const respondTravelBuddyRequest = catchAsync(
	async (req: Request, res: Response) => {
		const buddyId = req.params.buddyId;
		const user = req.user;
		// Call service function to respond to the travel buddy request
		const result = await tripBuddiesServices.respondTravelBuddyRequest(
			user,
			buddyId,
			req.body
		);
		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Travel buddy request responded successfully",
			data: result,
		});
	}
);

export const tripBuddiesController = {
	getTravelBuddiesForATrip,
	respondTravelBuddyRequest,
};
