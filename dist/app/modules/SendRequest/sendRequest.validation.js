"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRequestValidations = void 0;
const zod_1 = require("zod");
const sendTravelRequest = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({ required_error: "User id is required" }),
    }),
});
exports.sendRequestValidations = {
    sendTravelRequest,
};
