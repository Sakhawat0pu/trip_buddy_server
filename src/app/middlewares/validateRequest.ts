import { AnyZodObject } from "zod";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

// Middleware function for validating requests against a Zod schema
const validateRequest = (schema: AnyZodObject) => {
	// Return an async middleware function
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		// Parse request body and cookies against the provided schema
		await schema.parseAsync({
			body: req.body,
			cookies: req.cookies,
		});
		next();
	});
};

export default validateRequest;
