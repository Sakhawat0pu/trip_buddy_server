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
exports.tripBuddiesServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// Function to retrieve travel buddies for a trip from the database
const getTravelBuddiesForATripFromDb = (tripId) => __awaiter(void 0, void 0, void 0, function* () {
    const trip = yield prisma_1.default.trip.findUniqueOrThrow({
        where: {
            id: tripId,
        },
    });
    const travelBuddies = yield prisma_1.default.tripBuddyRequest.findMany({
        where: {
            tripId: trip.id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            trip: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
    return travelBuddies;
});
// Function to respond to a travel buddy request
const respondTravelBuddyRequest = (userInfo, buddyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: buddyId,
        },
    });
    const respondToTrip = yield prisma_1.default.tripBuddyRequest.findFirst({
        where: {
            userId: buddyId,
            tripId: payload.tripId,
            trip: {
                userId: userInfo.id,
            },
        },
    });
    if (!respondToTrip) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No trip buddy request request found!");
    }
    const result = yield prisma_1.default.tripBuddyRequest.update({
        where: {
            id: respondToTrip.id,
        },
        data: {
            status: payload.status,
        },
    });
    return result;
});
const getAllRequestToJoinMyTrips = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.tripBuddyRequest.findMany({
        where: {
            trip: {
                userId: userInfo.id,
            },
        },
        include: {
            user: true,
            trip: true,
        },
    });
    return result;
});
exports.tripBuddiesServices = {
    getTravelBuddiesForATripFromDb,
    respondTravelBuddyRequest,
    getAllRequestToJoinMyTrips,
};
