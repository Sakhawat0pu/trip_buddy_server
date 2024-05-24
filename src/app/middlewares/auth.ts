import { JwtPayload, Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config";

import prisma from "../shared/prisma";
import { jwtHelpers } from "../modules/Auth/auth.utils";

// Middleware function for authentication
const auth = (...requiredRoles: string[]) => {
	// Return an async middleware function
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		// Extract token from request headers
		const token = req.headers.authorization;

		// Check if token exists
		if (!token) {
			throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized user");
		}

		// Verify the token
		const decoded = jwtHelpers.verifyToken(
			token,
			config.jwt_access_secret as Secret
		) as JwtPayload;

		const { id, role } = decoded;

		// Retrieve user from the database using id
		const user = await prisma.user.findUnique({
			where: {
				id: id,
			},
		});

		// If user doesn't exist, throw a not found error
		if (!user) {
			throw new AppError(
				httpStatus.NOT_FOUND,
				"Specified user does not exist in the database"
			);
		}

		if (user?.status === "DELETED") {
			throw new AppError(httpStatus.FORBIDDEN, "User not found");
		}

		if (user?.status === "BLOCKED") {
			throw new AppError(httpStatus.FORBIDDEN, "User has been blocked");
		}

		if (requiredRoles && !requiredRoles.includes(role)) {
			throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized user");
		}

		// Attach decoded token (user information) to the request object
		req.user = decoded;
		next();
	});
};

export default auth;
