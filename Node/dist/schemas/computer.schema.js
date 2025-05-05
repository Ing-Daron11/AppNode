"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computerSchema = void 0;
const zod_1 = require("zod");
exports.computerSchema = (0, zod_1.object)({
    name: (0, zod_1.string)({ required_error: "Name is required" }),
    category: (0, zod_1.string)({ required_error: "Category is required" }),
    pricePerDay: (0, zod_1.string)({ required_error: "Price per day is required" }),
});
