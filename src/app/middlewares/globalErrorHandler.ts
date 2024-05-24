import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import handleZodError from "../errors/handleZodError";
import { ZodError } from "zod";

// Global error handler middleware
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	let statusCode = 500;
	let message = "Something went wrong!";
	let errorDetails = err;

	// Handle ZodError
	if (err instanceof ZodError) {
		const simplifiedError = handleZodError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorDetails = simplifiedError.errorSources;
	} // Handle duplicate key error
	else if (err.code === 11000) {
		const simplifiedError = handleDuplicateError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorDetails = simplifiedError.errorSources;
	} // Handle JWT token expiration error
	else if (err.name === "TokenExpiredError") {
		statusCode = httpStatus.UNAUTHORIZED;
		message = "Unauthorized User";
	} // Handle custom AppError
	else if (err instanceof AppError) {
		statusCode = err?.statusCode;
		message = err?.message;
	} // Handle other general errors
	else if (err instanceof Error) {
		message = err?.message;
	}

	return res.status(statusCode).json({
		success: false,
		message,
		errorDetails,
	});
};

export default globalErrorHandler;
