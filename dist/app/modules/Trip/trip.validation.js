"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripValidation = void 0;
const zod_1 = require("zod");
const createTripValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        destination: zod_1.z.string({ required_error: "Destination is required" }),
        tripType: zod_1.z.string({ required_error: "Trip type is required" }),
        description: zod_1.z.string({ required_error: "Trip description is required" }),
        startDate: zod_1.z.string({ required_error: "Trip start date is required" }),
        endDate: zod_1.z.string({ required_error: "Trip end date is required" }),
        budget: zod_1.z.number({ required_error: "Budget is required" }),
        activities: zod_1.z.array(zod_1.z.string(), {
            required_error: "Activities field is required",
        }),
    }),
});
exports.tripValidation = {
    createTripValidationSchema,
};
