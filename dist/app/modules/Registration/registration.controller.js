"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const registration_services_1 = require("./registration.services");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// Controller function for registering a user
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the registration service function to register the user into the database
    const result = yield registration_services_1.registrationServices.registerUserIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "User registered successfully",
        data: result,
    });
}));
exports.registrationControllers = {
    registerUser,
};
