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
		message: "My profile retrieved successfully",
		data: result,
	});
});

// Controller function to retrieve the all the users profile
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const result = await userServices.getAllUsers();
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User profiles retrieved successfully",
		data: result,
	});
});

// Controller function to retrieve the a user profile by ID
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.userId;
	const result = await userServices.getSingleUser(id);
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

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.userId;

	const result = await userServices.updateUserStatusIntoDb(userId, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User status updated successfully",
		data: result,
	});
});

export const userControllers = {
	getMe,
	getAllUsers,
	getSingleUser,
	updateMe,
	updateUserRole,
	updateUserStatus,
};
