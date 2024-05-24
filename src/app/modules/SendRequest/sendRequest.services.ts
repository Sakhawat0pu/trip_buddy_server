import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TripBuddyRequest } from "@prisma/client";

// Service function for sending a travel request
const sendTravelRequest = async (
	userInfo: JwtPayload,
	tripId: string,
	payload: TripBuddyRequest
) => {
	// Retrieve the trip information from the database
	const trip = await prisma.trip.findUnique({
		where: {
			id: tripId,
		},
	});

	if (!trip) {
		throw new AppError(httpStatus.NOT_FOUND, "Specified trip not found!");
	}

	payload.tripId = trip.id;
	payload.userId = userInfo.id;

	// Create a new trip buddy request in the database
	const result = await prisma.tripBuddyRequest.create({
		data: payload,
		include: {
			trip: true,
			user: true,
		},
	});

	return result;
};

export const sendRequestServices = {
	sendTravelRequest,
};
