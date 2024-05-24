import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import { Prisma, Trip } from "@prisma/client";
import { TPaginationOptions } from "../../interface/pagination";
import calculatePagination from "../../utils/calculatePagination";
import { Request } from "express";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// Service function for creating a new trip
const createTripIntoDb = async (req: Request) => {
	const userInfo = req.user;
	const payload = req.body;
	const files = req.files as Express.Multer.File[];
	// Assign the user ID from the JWT payload to the trip payload
	payload.userId = userInfo.id;
	payload.photos = [];
	if (files && files.length) {
		files.forEach(async (file) => {
			const imgData: any = await uploadImageToCloudinary(file);
			payload.photos.push(imgData.secure_url);
		});
	}

	// Create a new trip in the database
	const result = await prisma.trip.create({
		data: payload,
	});

	return result;
};

// Service function for retrieving all trips from the database with filtering and pagination
const getAllTripsFromDb = async (
	params: Record<string, unknown>,
	options: TPaginationOptions
) => {
	// Destructure filter parameters
	const { searchTerm, minBudget, maxBudget, ...filterData } = params;

	// Array to store AND conditions for filtering
	const andConditions: Prisma.TripWhereInput[] = [];

	// Handle search term filtering
	if (searchTerm) {
		andConditions.push({
			OR: [
				{
					destination: {
						contains: searchTerm as string,
						mode: "insensitive",
					},
				},
				{
					tripType: {
						contains: searchTerm as string,
						mode: "insensitive",
					},
				},
				{
					description: {
						contains: searchTerm as string,
						mode: "insensitive",
					},
				},
				{
					budget: {
						equals: isNaN(Number(searchTerm)) ? 0 : Number(searchTerm),
					},
				},
			],
		});
	}

	// Handle additional filter data
	if (Object.keys(filterData).length) {
		andConditions.push({
			AND: Object.keys(filterData).map((key) => ({
				[key]: {
					equals: filterData[key],
				},
			})),
		});
	}

	// Handle budget range filtering
	if (minBudget || maxBudget) {
		andConditions.push({
			AND: [
				{
					budget: {
						gte: isNaN(Number(minBudget)) ? 0 : Number(minBudget),
					},
				},
				{
					budget: {
						lte: isNaN(Number(maxBudget)) ? 100000000 : Number(maxBudget),
					},
				},
			],
		});
	}

	// Construct the WHERE condition for the Prisma query
	const whereCondition: Prisma.TripWhereInput = { AND: andConditions };
	// Calculate pagination parameters
	const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

	// Retrieve trips from the database based on filtering, pagination, and sorting
	const result = await prisma.trip.findMany({
		where: whereCondition,
		skip: skip,
		take: limit,
		orderBy: {
			[sortBy]: sortOrder,
		},
	});

	// Count total number of documents matching the filter criteria
	const totalDocuments = await prisma.trip.count({
		where: whereCondition,
	});

	// Calculate total number of pages based on total documents and pagination limit
	const totalPages = Math.ceil(totalDocuments / limit);

	// Prepare pagination metadata
	const meta = { page, limit, totalPages, totalDocuments };
	return {
		meta,
		data: result,
	};
};

const getSingleTripFromDb = async (tripId: string) => {
	const tripData = await prisma.trip.findUnique({
		where: {
			id: tripId,
		},
		include: {
			user: true,
			tripBuddyRequest: true,
		},
	});

	if (!tripData) {
		throw new AppError(httpStatus.NOT_FOUND, "Specified trip not found!");
	}

	return tripData;
};

const getAllMyRequestedTrips = async (user: JwtPayload) => {
	const result = await prisma.tripBuddyRequest.findMany({
		where: {
			userId: user.id,
		},
		include: {
			trip: true,
			user: true,
		},
	});
};

const getAllMyPostedTrips = async (user: JwtPayload) => {
	const result = await prisma.trip.findMany({
		where: {
			userId: user.id,
		},
		include: {
			user: true,
			tripBuddyRequest: true,
		},
	});
};

const deleteAPostFromDb = async (tripId: string) => {
	const tripInfo = await prisma.trip.findUnique({
		where: {
			id: tripId,
		},
		include: {
			tripBuddyRequest: true,
		},
	});

	if (!tripInfo) {
		throw new AppError(httpStatus.NOT_FOUND, "Specified trip not found!");
	}

	const result = await prisma.$transaction(async (client) => {
		tripInfo?.tripBuddyRequest.forEach(async (buddyRequest) => {
			await client.tripBuddyRequest.delete({
				where: {
					id: buddyRequest.id,
				},
			});
		});

		const deletedTrip = await client.trip.delete({
			where: {
				id: tripId,
			},
		});

		return deletedTrip;
	});

	return result;
};

export const tripServices = {
	createTripIntoDb,
	getAllTripsFromDb,
	getSingleTripFromDb,
	getAllMyRequestedTrips,
	getAllMyPostedTrips,
	deleteAPostFromDb,
};
