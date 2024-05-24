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
const createTripIntoDb = (payload, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    payload.userId = userInfo.id;
    const result = yield prisma_1.default.trip.create({
        data: payload,
    });
    return result;
});
const getAllTripsFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, minBudget, maxBudget } = params, filterData = __rest(params, ["searchTerm", "minBudget", "maxBudget"]);
    const andConditions = [];
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
                    budget: {
                        equals: isNaN(Number(searchTerm)) ? 0 : Number(searchTerm),
                    },
                },
            ],
        });
    }
    if (Object.keys(filterData).length) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
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
    const whereCondition = { AND: andConditions };
    const { page, limit, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(options);
    const result = yield prisma_1.default.trip.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalDocuments = yield prisma_1.default.trip.count({
        where: whereCondition,
    });
    const totalPages = Math.ceil(totalDocuments / limit);
    const meta = { page, limit, totalPages, totalDocuments };
    return {
        meta,
        data: result,
    };
});
exports.tripServices = {
    createTripIntoDb,
    getAllTripsFromDb,
};
