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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalController = void 0;
const services_1 = require("../services");
class RentalController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rentalData = req.body;
                const rental = yield services_1.rentalService.create(rentalData);
                res.status(201).json(rental);
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    res.status(400).json({ message: "Rental already exists" });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rentals = yield services_1.rentalService.findAll();
                res.status(200).json(rentals);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const rental = yield services_1.rentalService.getById(id);
                if (!rental) {
                    res.status(404).json({ message: "Rental not found" });
                    return;
                }
                res.status(200).json(rental);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const rentalData = req.body;
                const rental = yield services_1.rentalService.update(id, rentalData);
                if (!rental) {
                    res.status(404).json({ message: "Rental not found" });
                    return;
                }
                res.status(200).json(rental);
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const rental = yield services_1.rentalService.delete(id);
                if (!rental) {
                    res.status(404).json({ message: "Rental not found" });
                    return;
                }
                res.status(200).json({ message: "Rental deleted successfully" });
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.rentalController = new RentalController();
