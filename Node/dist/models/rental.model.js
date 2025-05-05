"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rentalSchema = new mongoose_1.default.Schema({
    computerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Computer", required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, required: true },
    timeLimit: { type: Number, required: true },
    initDate: { type: Date, required: true },
    finalDate: { type: Date, required: true },
}, { timestamps: true, collection: "rentals" });
exports.RentalModel = mongoose_1.default.model("Rental", rentalSchema);
