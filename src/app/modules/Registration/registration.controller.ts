import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { registrationServices } from "./registration.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// Controller function for registering a user
const registerUser = catchAsync(async (req: Request, res: Response) => {
	// Call the registration service function to register the user into the database
	const result = await registrationServices.registerUserIntoDb(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "User registered successfully",
		data: result,
	});
});

export const registrationControllers = {
	registerUser,
};
