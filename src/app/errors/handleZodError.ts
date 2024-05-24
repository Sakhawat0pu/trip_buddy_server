import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import httpStatus from "http-status";

// Define a function to handle Zod errors
const handleZodError = (err: ZodError): TGenericErrorResponse => {
	// Map each ZodIssue to an error source object
	const errorSources: TErrorSources[] = err.issues.map((issue: ZodIssue) => {
		return {
			field: issue?.path[issue.path.length - 1],
			message: issue.message,
		};
	});

	return {
		statusCode: httpStatus.BAD_REQUEST,
		message: "Validation Error!",
		errorSources,
	};
};

export default handleZodError;
