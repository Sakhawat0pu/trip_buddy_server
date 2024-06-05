"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define a function to send a standardized response
const sendResponse = (res, data) => {
    // Send JSON response with status code, success status, message, metadata, and data
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data === null || data === void 0 ? void 0 : data.message,
        meta: data === null || data === void 0 ? void 0 : data.meta,
        data: data.data,
    });
};
exports.default = sendResponse;
