import { JwtPayload } from "jsonwebtoken";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { UserRole, UserStatus } from "@prisma/client";

/**
 * Retrieves user profile information from the database based on the user's JWT payload.
 * @param userInfo The JWT payload containing user information.
 * @returns A promise that resolves to the user profile information.
 */
const getMeFromDb = async (userInfo: JwtPayload) => {
	// Find the user in the database based on the user ID from the JWT payload
	const result = await prisma.user.findUniqueOrThrow({
		where: {
			id: userInfo.id,
			status: UserStatus.ACTIVE,
		},
		select: {
			id: true,
			name: true,
			email: true,
			status: true,
			role: true,
			userProfile: true,
			createdAt: true,
			updatedAt: true,
		},
	});
	return result;
};

const getAllUsers = async () => {
	const result = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			status: true,
			userProfile: true,
		},
	});

	return result;
};

const getSingleUser = async (userId: string) => {
	const result = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			userProfile: true,
		},
	});

	if (!result) {
		throw new AppError(httpStatus.NOT_FOUND, "Specified user not found!");
	}

	return result;
};

/**
 * Updates user profile information in the database based on the user's JWT payload and the provided payload.
 * @param userInfo The JWT payload containing user information.
 * @param payload The payload containing updated user profile information.
 * @returns A promise that resolves to the updated user profile information.
 */
const updateMeIntoDb = async (
	userInfo: JwtPayload,
	payload: Record<string, any>
) => {
	// Find the user in the database based on the user ID from the JWT payload
	const userData = await prisma.user.findUnique({
		where: {
			id: userInfo.id,
			status: UserStatus.ACTIVE,
		},
	});

	if (!userData) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	if (payload?.email) {
		const userExistWithTheProvidedEmail = await prisma.user.findUnique({
			where: {
				email: payload.email,
			},
		});

		if (userExistWithTheProvidedEmail) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"User already exists with the provided email!"
			);
		}
	}

	const profileData = {
		age: payload?.profile?.age,
		bio: payload?.profile?.bio,
	};

	const result = await prisma.$transaction(async (client) => {
		const updatedUserProfile = await client.userProfile.update({
			where: {
				userId: userData.id,
			},
			data: profileData,
		});

		const updatedUserInfo = await client.user.update({
			where: {
				id: userData.id,
			},
			data: { name: payload?.name, email: payload?.email },
			select: {
				id: true,
				name: true,
				email: true,
				userProfile: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return updatedUserInfo;
	});
	return result;
};

const updateUserRoleIntoDb = async (
	userId: string,
	payload: { role: UserRole }
) => {
	const userData = await prisma.user.update({
		where: {
			id: userId,
			status: UserStatus.ACTIVE,
		},
		data: payload,
		select: {
			id: true,
			name: true,
			email: true,
			status: true,
			role: true,
			userProfile: true,
		},
	});

	return userData;
};

const updateUserStatusIntoDb = async (
	userId: string,
	payload: { status: UserStatus }
) => {
	const userData = await prisma.user.update({
		where: {
			id: userId,
		},
		data: payload,
		select: {
			id: true,
			name: true,
			email: true,
			status: true,
			role: true,
			userProfile: true,
		},
	});

	return userData;
};

export const userServices = {
	getMeFromDb,
	getAllUsers,
	getSingleUser,
	updateMeIntoDb,
	updateUserRoleIntoDb,
	updateUserStatusIntoDb,
};
