"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// Define a function to handle duplicate errors
const handleDuplicateError = (err) => {
    // Extract the duplicated field from the error message
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    // Create an array of error sources with the duplicated field message
    const errorSources = [
        {
            field: "",
            message: `${extractedMessage} already exists`,
        },
    ];
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: "Duplicate Field error",
        errorSources,
    };
};
exports.default = handleDuplicateError;
