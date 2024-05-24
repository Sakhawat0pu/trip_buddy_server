import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn: RequestHandler) => {
	return (req: Request, res: Response, next: NextFunction) => {
		// Execute the original request handler function and catch any errors
		Promise.resolve(fn(req, res, next)).catch((err) => next(err));
	};
};

export default catchAsync;
