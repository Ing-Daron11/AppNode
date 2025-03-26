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
exports.computerController = void 0;
const services_1 = require("../services");
const constants_1 = require("../constants");
class ComputerController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, category, pricePerDay } = req.body;
                const computerData = { name, category, pricePerDay };
                // Validar que la categoría es válida
                if (!Object.values(constants_1.ComputerCategory).includes(computerData.category)) {
                    res.status(400).json({
                        message: `Invalid category. Allowed values: ${Object.values(constants_1.ComputerCategory).join(", ")}`,
                    });
                }
                const computer = yield services_1.computerService.create(computerData);
                res.status(201).json(computer);
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    res.status(400).json({ message: "Computer already exists" });
                }
                res.status(500).json({ message: "Internal server error" + error });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const computers = yield services_1.computerService.findAll();
                res.status(200).json(computers);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error: " + error });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const computerId = req.params.id;
                const computer = yield services_1.computerService.getById(computerId);
                if (!computer) {
                    res.status(404).json({ message: "Computer not found" });
                }
                res.status(200).json(computer);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error " + error });
            }
        });
    }
    getByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category } = req.params;
                if (!Object.values(constants_1.ComputerCategory).includes(category)) {
                    res.status(400).json({
                        message: `Invalid category. Allowed values: ${Object.values(constants_1.ComputerCategory).join(", ")}`,
                    });
                }
                const computers = yield services_1.computerService.getByCategory(category);
                res.status(200).json(computers);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error: " + error });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const computerData = req.body;
                // Validar que la categoría es válida
                if (computerData.category && !Object.values(constants_1.ComputerCategory).includes(computerData.category)) {
                    res.status(400).json({
                        message: `Invalid category. Allowed values: ${Object.values(constants_1.ComputerCategory).join(", ")}`,
                    });
                }
                const computer = yield services_1.computerService.update(id, computerData);
                if (!computer) {
                    res.status(404).json({ message: "Computer not found" });
                }
                res.status(200).json(computer);
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    res.status(400).json({ message: error.message });
                }
                res.status(500).json({ message: "Internal server error: " + error });
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                // Validar que el estado es válido
                if (!Object.values(constants_1.ComputerStatus).includes(status)) {
                    res.status(400).json({
                        message: `Invalid status. Allowed values: ${Object.values(constants_1.ComputerStatus).join(", ")}`,
                    });
                }
                const computer = yield services_1.computerService.updateStatus(id, status);
                if (!computer) {
                    res.status(404).json({ message: "Computer not found" });
                }
                res.status(200).json(computer);
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    res.status(400).json({ message: error.message });
                }
                res.status(500).json({ message: "Internal server error: " + error });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const computer = yield services_1.computerService.delete(id);
                if (!computer) {
                    res.status(404).json({ message: "Computer not found" });
                }
                res.status(200).json("Computer: " + computer + " deleted");
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    res.status(400).json({ message: error.message });
                }
                res.status(500).json({ message: "Internal server error: " + error });
            }
        });
    }
}
exports.computerController = new ComputerController();
