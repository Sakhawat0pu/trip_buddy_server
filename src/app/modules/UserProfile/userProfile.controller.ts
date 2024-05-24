import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./userProfile.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// Controller function to retrieve the user's profile
const getMe = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;

	const result = await userServices.getMeFromDb(user);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User profile retrieved successfully",
		data: result,
	});
});

// Controller function to update the user's profile
const updateMe = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;

	const result = await userServices.updateMeIntoDb(user, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User profile updated successfully",
		data: result,
	});
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.userId;

	const result = await userServices.updateUserRoleIntoDb(userId, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User role updated successfully",
		data: result,
	});
});

export const userControllers = {
	getMe,
	updateMe,
	updateUserRole,
};
