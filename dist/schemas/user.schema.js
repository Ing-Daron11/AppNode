"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = (0, zod_1.object)({
    name: (0, zod_1.string)({ required_error: "Name is required" }),
    email: (0, zod_1.string)({ required_error: "Name is required" })
        .email("Not a valid email address"),
    password: (0, zod_1.string)({ required_error: "Name is required" })
        .min(8, "Password  must be at least 8 characteres long"),
});
