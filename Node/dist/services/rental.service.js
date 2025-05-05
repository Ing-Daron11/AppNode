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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const constants_1 = require("../constants");
class RentalService {
    create(rentalInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const { userId, computerId, initDate, finalDate } = rentalInput;
                if (!userId || !computerId || !initDate || !finalDate) {
                    throw new ReferenceError("All fields must be completed");
                }
                if (new Date(initDate) >= new Date(finalDate)) {
                    throw new ReferenceError("Init date must be before final date");
                }
                const computer = yield models_1.ComputerModel.findById(computerId).session(session);
                if (!computer)
                    throw new ReferenceError("Computer not found");
                if (computer.status === constants_1.ComputerStatus.RENTED)
                    throw new ReferenceError("Computer is already rented");
                const user = yield models_1.UserModel.findById(userId).session(session);
                if (!user)
                    throw new ReferenceError("User not found");
                const rental = yield models_1.RentalModel.create([Object.assign({}, rentalInput)], { session });
                computer.status = constants_1.ComputerStatus.RENTED;
                yield computer.save({ session });
                yield session.commitTransaction();
                return rental[0];
            }
            catch (error) {
                yield session.abortTransaction();
                throw new Error("Error creating rental: " + error);
            }
            finally {
                session.endSession();
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.RentalModel.find()
                    .populate("userId", "name email")
                    .populate("computerId", "name status");
            }
            catch (error) {
                throw new Error("Error finding all rentals: " + error);
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rental = yield models_1.RentalModel.findById(id)
                    .populate("userId", "name email")
                    .populate("computerId", "name status");
                if (!rental)
                    throw new Error("Rental not found");
                return rental;
            }
            catch (error) {
                throw new Error("Error finding rental by id " + id + " " + error);
            }
        });
    }
    update(id, rentalInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rental = yield models_1.RentalModel.findById(id);
                if (!rental)
                    throw new Error("Rental not found");
                if (rentalInput.initDate && rentalInput.finalDate) {
                    if (new Date(rentalInput.initDate) >= new Date(rentalInput.finalDate)) {
                        throw new ReferenceError("Init date must be before final date");
                    }
                }
                return yield models_1.RentalModel.findByIdAndUpdate(id, rentalInput, { new: true });
            }
            catch (error) {
                throw new Error("Error updating rental by id " + id + " " + error);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const rental = yield models_1.RentalModel.findById(id).session(session);
                if (!rental)
                    throw new Error("Rental not found");
                const computer = yield models_1.ComputerModel.findById(rental.computerId).session(session);
                if (computer) {
                    computer.status = constants_1.ComputerStatus.AVAILABLE;
                    yield computer.save({ session });
                }
                const deletedRental = yield models_1.RentalModel.findByIdAndDelete(id, { session });
                yield session.commitTransaction();
                return deletedRental;
            }
            catch (error) {
                yield session.abortTransaction();
                throw new Error("Error deleting rental by id " + id + " " + error);
            }
            finally {
                session.endSession();
            }
        });
    }
}
exports.rentalService = new RentalService();
