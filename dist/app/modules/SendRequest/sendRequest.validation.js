"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestValidations = void 0;
const zod_1 = require("zod");
// Validation schema for sending a travel request
const sendTravelRequest = zod_1.z.object({
    body: zod_1.z.object({
        requesterName: zod_1.z.string({ required_error: "Requester name is required" }),
        requesterContactNo: zod_1.z.string({
            required_error: "Requester name is required",
        }),
        requesterEmail: zod_1.z.string({ required_error: "Requester name is required" }),
        requesterAccomPreference: zod_1.z.string().optional(),
        message: zod_1.z.string().optional(),
    }),
});
exports.sendRequestValidations = {
    sendTravelRequest,
};
