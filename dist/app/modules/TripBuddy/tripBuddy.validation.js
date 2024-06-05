"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripBuddyValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Zod validation schema for responding to a buddy request
const respondBuddyRequestValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        tripId: zod_1.z.string({ required_error: "Trip id is required." }),
        status: zod_1.z.enum([
            client_1.RequestStatus.APPROVED,
            client_1.RequestStatus.PENDING,
            client_1.RequestStatus.REJECTED,
        ]),
    }),
});
exports.tripBuddyValidations = {
    respondBuddyRequestValidationSchema,
};
