"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Function to create a JWT token
const createToken = (jwtPayload, secretKey, expiresIn) => {
    return jsonwebtoken_1.default.sign(jwtPayload, secretKey, { expiresIn });
};
// Function to verify a JWT token
const verifyToken = (token, secretKey) => {
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.jwtHelpers = {
    createToken,
    verifyToken,
};
