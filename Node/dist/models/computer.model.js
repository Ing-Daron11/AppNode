"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
const computerSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: Object.values(constants_1.ComputerCategory), required: true },
    status: { type: String, required: true, enum: Object.values(constants_1.ComputerStatus), default: "Available" },
    pricePerDay: { type: Number, required: true },
}, { timestamps: true, collection: "computers" });
exports.ComputerModel = mongoose_1.default.model("Computer", computerSchema);
