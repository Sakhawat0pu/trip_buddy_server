import bcrypt from "bcrypt";
import config from "../../config";
import prisma from "../../shared/prisma";
import { UserRole } from "@prisma/client";

// Service function for registering a user into the database
const registerUserIntoDb = async (payload: Record<string, any>) => {
	// Hash the user's password
	const hashedPassword = await bcrypt.hash(
		payload?.password,
		Number(config.bcrypt_salt_round)
	);

	const userData = {
		name: payload.name,
		email: payload.email,
		role: payload?.role || UserRole.TRAVELER,
		password: hashedPassword,
	};

	// Perform a transaction to create user and user profile records atomically
	const result = await prisma.$transaction(async (client) => {
		// Create user record
		const createdUserData = await client.user.create({
			data: userData,
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		// Create user profile record if profile data is provided
		await client.userProfile.create({
			data: {
				userId: createdUserData.id,
				bio: payload?.profile?.bio,
				age: payload?.profile?.age,
			},
		});

		return createdUserData;
	});

	return result;
};

export const registrationServices = {
	registerUserIntoDb,
};
