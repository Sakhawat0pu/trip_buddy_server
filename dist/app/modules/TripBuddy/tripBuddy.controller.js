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
exports.tripBuddiesController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const tripBuddy_services_1 = require("./tripBuddy.services");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const getTravelBuddiesForATrip = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tripId = req.params.tripId;
    const result = yield tripBuddy_services_1.tripBuddiesServices.getTravelBuddiesForATripFromDb(tripId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Potential travel buddies retrieved successfully",
        data: result,
    });
}));
const respondTravelBuddyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buddyId = req.params.buddyId;
    const user = req.user;
    const result = yield tripBuddy_services_1.tripBuddiesServices.respondTravelBuddyRequest(user, buddyId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Travel buddy request responded successfully",
        data: result,
    });
}));
exports.tripBuddiesController = {
    getTravelBuddiesForATrip,
    respondTravelBuddyRequest,
};
