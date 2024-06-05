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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const calculatePagination_1 = __importDefault(require("../../utils/calculatePagination"));
const uploadImageToCloudinary_1 = require("../../utils/uploadImageToCloudinary");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// Service function for creating a new trip
const createTripIntoDb = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req.user;
    const payload = req.body;
    const files = req.files;
    // Assign the user ID from the JWT payload to the trip payload
    payload.userId = userInfo.id;
    payload.photos = [];
    if (files && files.length) {
        const uploadPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const imgData = yield (0, uploadImageToCloudinary_1.uploadImageToCloudinary)(file);
            payload.photos.push(imgData.secure_url);
        }));
        yield Promise.all(uploadPromises);
    }
    // Create a new trip in the database
    const result = yield prisma_1.default.trip.create({
        data: payload,
    });
    return result;
});
// Service function for retrieving all trips from the database with filtering and pagination
const getAllTripsFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructure filter parameters
    const { searchTerm, minBudget, maxBudget } = params, filterData = __rest(params, ["searchTerm", "minBudget", "maxBudget"]);
    // Array to store AND conditions for filtering
    const andConditions = [];
    // Handle search term filtering
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    destination: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    tripType: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    budget: {
                        equals: isNaN(Number(searchTerm)) ? 0 : Number(searchTerm),
                    },
                },
            ],
        });
    }
    // Handle additional filter data
    if (Object.keys(filterData).length) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    // Handle budget range filtering
    if (minBudget || maxBudget) {
        andConditions.push({
            AND: [
                {
                    budget: {
                        gte: isNaN(Number(minBudget)) ? 0 : Number(minBudget),
                    },
                },
                {
                    budget: {
                        lte: isNaN(Number(maxBudget)) ? 100000000 : Number(maxBudget),
                    },
                },
            ],
        });
    }
    // Construct the WHERE condition for the Prisma query
    const whereCondition = { AND: andConditions };
    // Calculate pagination parameters
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(options);
    // Retrieve trips from the database based on filtering, pagination, and sorting
    const result = yield prisma_1.default.trip.findMany({
        where: whereCondition,
        include: {
            user: {
                select: {
                    name: true,
                    role: true,
                    email: true,
                },
            },
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    // Count total number of documents matching the filter criteria
    const totalDocuments = yield prisma_1.default.trip.count({
        where: whereCondition,
    });
    // Calculate total number of pages based on total documents and pagination limit
    const totalPages = Math.ceil(totalDocuments / limit);
    // Prepare pagination metadata
    const meta = { page, limit, totalPages, totalDocuments };
    return {
        meta,
        data: result,
    };
});
const getSingleTripFromDb = (tripId) => __awaiter(void 0, void 0, void 0, function* () {
    const tripData = yield prisma_1.default.trip.findUnique({
        where: {
            id: tripId,
        },
        include: {
            user: {
                select: {
                    name: true,
                    role: true,
                    email: true,
                },
            },
            tripBuddyRequest: true,
        },
    });
    if (!tripData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Specified trip not found!");
    }
    return tripData;
});
const getAllMyRequestedTrips = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(options);
    const result = yield prisma_1.default.tripBuddyRequest.findMany({
        where: {
            userId: user.id,
        },
        include: {
            trip: {
                select: {
                    id: true,
                    userId: true,
                    destination: true,
                    tripType: true,
                    description: true,
                    photos: true,
                    startDate: true,
                    endDate: true,
                    budget: true,
                    activities: true,
                    user: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalDocuments = yield prisma_1.default.tripBuddyRequest.count({
        where: {
            userId: user.id,
        },
    });
    // Calculate total number of pages based on total documents and pagination limit
    const totalPages = Math.ceil(totalDocuments / limit);
    // Prepare pagination metadata
    const meta = { page, limit, totalPages, totalDocuments };
    return {
        meta,
        data: result,
    };
});
const getAllMyPostedTrips = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(options);
    const result = yield prisma_1.default.trip.findMany({
        where: {
            userId: user.id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            tripBuddyRequest: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalDocuments = yield prisma_1.default.trip.count({
        where: {
            userId: user.id,
        },
    });
    // Calculate total number of pages based on total documents and pagination limit
    const totalPages = Math.ceil(totalDocuments / limit);
    // Prepare pagination metadata
    const meta = { page, limit, totalPages, totalDocuments };
    return {
        meta,
        data: result,
    };
});
const getAllJoinRequestsForMyPostedTrips = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(options);
    const result = yield prisma_1.default.tripBuddyRequest.findMany({
        where: {
            trip: {
                user: {
                    id: user.id,
                },
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            trip: {
                select: {
                    id: true,
                    userId: true,
                    destination: true,
                    tripType: true,
                    description: true,
                    photos: true,
                    startDate: true,
                    endDate: true,
                    budget: true,
                    activities: true,
                    user: true,
                },
            },
        },
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalDocuments = yield prisma_1.default.tripBuddyRequest.count({
        where: {
            trip: {
                user: {
                    id: user.id,
                },
            },
        },
    });
    // Calculate total number of pages based on total documents and pagination limit
    const totalPages = Math.ceil(totalDocuments / limit);
    // Prepare pagination metadata
    const meta = { page, limit, totalPages, totalDocuments };
    return {
        meta,
        data: result,
    };
});
const deleteAPostFromDb = (tripId) => __awaiter(void 0, void 0, void 0, function* () {
    const tripInfo = yield prisma_1.default.trip.findUnique({
        where: {
            id: tripId,
        },
        include: {
            tripBuddyRequest: true,
        },
    });
    if (!tripInfo) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Specified trip not found!");
    }
    const result = yield prisma_1.default.$transaction((client) => __awaiter(void 0, void 0, void 0, function* () {
        tripInfo === null || tripInfo === void 0 ? void 0 : tripInfo.tripBuddyRequest.forEach((buddyRequest) => __awaiter(void 0, void 0, void 0, function* () {
            yield client.tripBuddyRequest.delete({
                where: {
                    id: buddyRequest.id,
                },
            });
        }));
        const deletedTrip = yield client.trip.delete({
            where: {
                id: tripId,
            },
        });
        return deletedTrip;
    }));
    return result;
});
exports.tripServices = {
    createTripIntoDb,
    getAllTripsFromDb,
    getAllJoinRequestsForMyPostedTrips,
    getSingleTripFromDb,
    getAllMyRequestedTrips,
    getAllMyPostedTrips,
    deleteAPostFromDb,
};
