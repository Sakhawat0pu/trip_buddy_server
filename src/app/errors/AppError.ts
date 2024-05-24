class AppError extends Error {
	public statusCode: number;

	constructor(statusCode: number, message: string, stack = "") {
		// Call the constructor of the parent class (Error) with the provided message
		super(message);
		this.statusCode = statusCode;
		// If a stack trace is provided, set it; otherwise, capture the stack trace
		if (stack) {
			this.stack = stack;
		} else {
			// Capture the stack trace for this error instance
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export default AppError;
