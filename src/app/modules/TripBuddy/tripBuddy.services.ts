import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import { RequestStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// Function to retrieve travel buddies for a trip from the database
const getTravelBuddiesForATripFromDb = async (tripId: string) => {
	const trip = await prisma.trip.findUniqueOrThrow({
		where: {
			id: tripId,
		},
	});

	const travelBuddies = await prisma.tripBuddyRequest.findMany({
		where: {
			tripId: trip.id,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			trip: {
				select: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			},
		},
	});

	return travelBuddies;
};

// Function to respond to a travel buddy request
const respondTravelBuddyRequest = async (
	userInfo: JwtPayload,
	buddyId: string,
	payload: { tripId: string; status: RequestStatus }
) => {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: buddyId,
		},
	});

	const respondToTrip = await prisma.tripBuddyRequest.findFirst({
		where: {
			userId: buddyId,
			tripId: payload.tripId,
			trip: {
				userId: userInfo.id,
			},
		},
	});

	if (!respondToTrip) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"No trip buddy request request found!"
		);
	}

	const result = await prisma.tripBuddyRequest.update({
		where: {
			id: respondToTrip.id,
		},
		data: {
			status: payload.status,
		},
	});

	return result;
};

const getAllRequestToJoinMyTrips = async (userInfo: JwtPayload) => {
	const result = await prisma.tripBuddyRequest.findMany({
		where: {
			trip: {
				userId: userInfo.id,
			},
		},
		include: {
			user: true,
			trip: true,
		},
	});

	return result;
};

export const tripBuddiesServices = {
	getTravelBuddiesForATripFromDb,
	respondTravelBuddyRequest,
	getAllRequestToJoinMyTrips,
};
