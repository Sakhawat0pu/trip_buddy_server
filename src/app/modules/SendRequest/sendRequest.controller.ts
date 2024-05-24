import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { sendRequestServices } from "./sendRequest.services";

// Controller function for sending a travel request
const sendTravelRequest = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;
	const tripId = req.params.tripId;

	// Call the service function to send the travel request
	const result = await sendRequestServices.sendTravelRequest(
		user,
		tripId,
		req.body
	);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Travel buddy request sent successfully",
		data: result,
	});
});

export const sendRequestController = {
	sendTravelRequest,
};
