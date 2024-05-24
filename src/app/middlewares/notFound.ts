import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

// Middleware function for handling 404 Not Found errors
const notFound = (req: Request, res: Response, next: NextFunction) => {
	res.status(httpStatus.NOT_FOUND).json({
		success: false,
		message: "API not found",
		error: {
			path: req.originalUrl,
			message: "Requested path not found!",
		},
	});
};

export default notFound;
