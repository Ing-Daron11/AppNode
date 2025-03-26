"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalSchema = void 0;
const zod_1 = require("zod");
exports.rentalSchema = (0, zod_1.object)({
    device: (0, zod_1.string)({ required_error: "Device ID is required" })
        .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId format"),
    user: (0, zod_1.string)({ required_error: "User ID is required" })
        .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId format"),
    quantity: (0, zod_1.number)({ required_error: "Quantity is required" })
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
    timeLimit: (0, zod_1.number)({ required_error: "Time limit is required" })
        .int("Time limit must be an integer")
        .min(1, "Time limit must be at least 1 hour"),
    initDate: (0, zod_1.date)({ required_error: "Initial date is required" }),
    finalDate: (0, zod_1.date)({ required_error: "Final date is required" })
        .refine((val) => val > new Date(), "Final date must be in the future"),
});
