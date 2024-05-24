import httpStatus from "http-status";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// Define a function to handle duplicate errors
const handleDuplicateError = (err: any): TGenericErrorResponse => {
	// Extract the duplicated field from the error message
	const match = err.message.match(/"([^"]*)"/);
	const extractedMessage = match && match[1];
	// Create an array of error sources with the duplicated field message
	const errorSources: TErrorSources[] = [
		{
			field: "",
			message: `${extractedMessage} already exists`,
		},
	];

	return {
		statusCode: httpStatus.BAD_REQUEST,
		message: "Duplicate Field error",
		errorSources,
	};
};

export default handleDuplicateError;
