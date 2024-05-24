"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleDuplicateError = (err) => {
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
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
