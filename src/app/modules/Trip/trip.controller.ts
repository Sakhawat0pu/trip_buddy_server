import httpStatus from "http-status";
import { tripServices } from "./trip.services";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { filterableTripFields } from "./trip.constant";
import pick from "../../shared/pick";

// Controller function for creating a new trip
const createTrip = catchAsync(async (req: Request, res: Response) => {
	// Call service function to create trip
	const result = await tripServices.createTripIntoDb(req);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Trip created successfully",
		data: result,
	});
});

// Controller function for retrieving all trips
const getAllTrips = catchAsync(async (req: Request, res: Response) => {
	// Extract filterable parameters from request query
	const params = pick(req.query, filterableTripFields);
	// Extract pagination and sorting options from request query
	const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

	const result = await tripServices.getAllTripsFromDb(params, options);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Trips retrieved successfully",
		meta: result?.meta,
		data: result?.data,
	});
});

const getSingleTrip = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.tripId;

	const result = await tripServices.getSingleTripFromDb(id);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Specified trip retrieved successfully",
		data: result,
	});
});

const getAllMyRequestedTrips = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user;
		const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
		// Call service function to retrieve all my requested trips
		const result = await tripServices.getAllMyRequestedTrips(user, options);
		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "All requested trips retrieved successfully",
			meta: result?.meta,
			data: result?.data,
		});
	}
);

const getAllMyPostedTrips = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;
	const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
	// Call service function to retrieve all my posted trips
	const result = await tripServices.getAllMyPostedTrips(user, options);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "My posted trips retrieved successfully",
		meta: result?.meta,
		data: result?.data,
	});
});

const getAllJoinRequestsForMyPostedTrips = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user;
		const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
		// Call service function to retrieve all my posted trips
		const result = await tripServices.getAllJoinRequestsForMyPostedTrips(
			user,
			options
		);
		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Join requests for my posted trips retrieved successfully",
			meta: result?.meta,
			data: result?.data,
		});
	}
);

const deleteAPost = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.tripId;
	// Call service function to retrieve all my posted trips
	const result = await tripServices.deleteAPostFromDb(id);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Travel post deleted successfully",
		data: result,
	});
});

export const tripController = {
	createTrip,
	getAllTrips,
	getSingleTrip,
	getAllMyRequestedTrips,
	getAllMyPostedTrips,
	getAllJoinRequestsForMyPostedTrips,
	deleteAPost,
};
