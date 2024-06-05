"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(statusCode, message, stack = "") {
        // Call the constructor of the parent class (Error) with the provided message
        super(message);
        this.statusCode = statusCode;
        // If a stack trace is provided, set it; otherwise, capture the stack trace
        if (stack) {
            this.stack = stack;
        }
        else {
            // Capture the stack trace for this error instance
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
