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
exports.sendRequestServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// Service function for sending a travel request
const sendTravelRequest = (userInfo, tripId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve the trip information from the database
    const trip = yield prisma_1.default.trip.findUnique({
        where: {
            id: tripId,
        },
    });
    if (!trip) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Specified trip not found!");
    }
    payload.tripId = trip.id;
    payload.userId = userInfo.id;
    // Create a new trip buddy request in the database
    const result = yield prisma_1.default.tripBuddyRequest.create({
        data: payload,
        include: {
            trip: true,
            user: true,
        },
    });
    return result;
});
exports.sendRequestServices = {
    sendTravelRequest,
};
