import { jwtHelpers } from "./auth.utils";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import { sendEmail } from "../../utils/sendEmail";

// Service function for user login
const loginUser = async (payload: { email: string; password: string }) => {
	const user = await prisma.user.findUnique({
		where: {
			email: payload?.email,
			status: UserStatus.ACTIVE,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	// Compare hashed password with provided password
	if (!(await bcrypt.compare(payload?.password, user.password))) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Incorrect Password, please provide the right password."
		);
	}

	const jwtPayload = {
		id: user.id,
		email: user.email,
		role: user.role,
	};

	// Create access token and refresh token
	const accessToken = jwtHelpers.createToken(
		jwtPayload,
		config.jwt_access_secret as string,
		config.jwt_access_token_expires_in as string
	);
	const refreshToken = jwtHelpers.createToken(
		jwtPayload,
		config.jwt_refresh_secret as string,
		config.jwt_refresh_token_expires_in as string
	);

	const loginData = {
		id: user.id,
		name: user.name,
		email: user.email,
		token: accessToken,
	};

	return {
		loginData,
		refreshToken,
	};
};

// Service function for refreshing access token
const refreshToken = async (token: string) => {
	const decoded = jwtHelpers.verifyToken(
		token,
		config.jwt_refresh_secret as string
	);

	if (!decoded) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized user");
	}

	const { id } = decoded;

	const user = await prisma.user.findUnique({
		where: {
			id: id,
			status: UserStatus.ACTIVE,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	const jwtPayload = {
		id: user.id,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtHelpers.createToken(
		jwtPayload,
		config.jwt_access_secret as string,
		config.jwt_access_token_expires_in as string
	);

	return { accessToken };
};

// Service function for changing user password
const changePasswordFromDb = async (
	user: JwtPayload,
	payload: { oldPassword: string; newPassword: string }
) => {
	const userInfo = await prisma.user.findUniqueOrThrow({
		where: {
			id: user?.id,
			status: UserStatus.ACTIVE,
		},
	});

	if (!userInfo) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	// Compare old password with the hashed password in the database
	const passwordMatched = await bcrypt.compare(
		payload?.oldPassword,
		userInfo.password
	);

	if (!passwordMatched) {
		throw new AppError(httpStatus.BAD_REQUEST, "Password did not matched");
	}

	const newHashedPassword = await bcrypt.hash(
		payload?.newPassword,
		Number(config.bcrypt_salt_round)
	);

	// Update user password in the database
	const updatedUser = await prisma.user.update({
		where: {
			id: userInfo?.id,
		},
		data: {
			password: newHashedPassword,
		},
		select: {
			id: true,
			name: true,
			email: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return updatedUser;
};

const forgotPassword = async (payload: { email: string }) => {
	const userInfo = await prisma.user.findUniqueOrThrow({
		where: {
			email: payload?.email,
			status: UserStatus.ACTIVE,
		},
	});

	const jwtPayload = {
		id: userInfo.id,
		email: userInfo.email,
		role: userInfo.role,
	};

	const resetToken = jwtHelpers.createToken(
		jwtPayload,
		config.reset_password_secret as string,
		config.reset_password_token_expires_in as string
	);

	const reset_pass_link = `${config.frontend_base_uri}/reset-password?userId=${userInfo.id}&token=${resetToken}`;
	const resetHtml = `
		<div>
			<p>
				Dear User,<br>
				We received a request to reset the password for your account. If you initiated this request, please follow the instructions below to reset your password.<br>
		Please click the link below:
			</p>
			<p>
				Click here, <a href=${reset_pass_link}>password reset link</a>
			</p>
		</div>
	`;
	await sendEmail(userInfo.email, resetHtml);
	return null;
};

const resetPassword = async (
	token: string | undefined,
	payload: { userId: string; password: string }
) => {
	const userInfo = await prisma.user.findUniqueOrThrow({
		where: {
			id: payload?.userId,
			status: UserStatus.ACTIVE,
		},
	});

	if (!token) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized user");
	}

	const decoded = jwtHelpers.verifyToken(
		token,
		config.reset_password_secret as string
	) as JwtPayload;

	if (!decoded) {
		throw new AppError(httpStatus.FORBIDDEN, "Reset token is not valid");
	}

	const { email } = decoded;

	const user = await prisma.user.findUnique({
		where: {
			email: email,
			status: UserStatus.ACTIVE,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.FORBIDDEN, "Reset token is not valid");
	}

	if (userInfo.id !== user.id) {
		throw new AppError(httpStatus.FORBIDDEN, "Reset token is not valid");
	}

	const hashedPassword = await bcrypt.hash(
		payload.password,
		Number(config.bcrypt_salt_round)
	);

	const updatedDate = await prisma.user.update({
		where: {
			id: payload?.userId,
		},
		data: {
			password: hashedPassword,
		},
		select: {
			email: true,
		},
	});

	return updatedDate;
};

export const authServices = {
	loginUser,
	refreshToken,
	changePasswordFromDb,
	forgotPassword,
	resetPassword,
};
