"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// Define a function to handle Zod errors
const handleZodError = (err) => {
    // Map each ZodIssue to an error source object
    const errorSources = err.issues.map((issue) => {
        return {
            field: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: issue.message,
        };
    });
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: "Validation Error!",
        errorSources,
    };
};
exports.default = handleZodError;
