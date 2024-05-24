import { Response } from "express";

// Define a type for metadata
type TMeta = {
	page: number;
	limit: number;
	totalDocuments: number;
	totalPages: number;
};

// Define a type for the response object
type TResponse<T> = {
	statusCode: number;
	success: boolean;
	message?: string;
	meta?: TMeta;
	data: T | null | undefined;
};

// Define a function to send a standardized response
const sendResponse = <T>(res: Response, data: TResponse<T>) => {
	// Send JSON response with status code, success status, message, metadata, and data
	res.status(data.statusCode).json({
		success: data.success,
		statusCode: data.statusCode,
		message: data?.message,
		meta: data?.meta,
		data: data.data,
	});
};

export default sendResponse;
