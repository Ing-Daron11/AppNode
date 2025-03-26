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
exports.computerService = void 0;
const models_1 = require("../models");
const constants_1 = require("../constants");
class ComputerService {
    create(computerInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!computerInput.name || !computerInput.category || !computerInput.pricePerDay) {
                    throw new ReferenceError("All fields must be completed");
                }
                // Validar que la categoría sea un valor permitido en ComputerCategory
                if (!Object.values(constants_1.ComputerCategory).includes(computerInput.category)) {
                    throw new ReferenceError(`Invalid category. Allowed values: ${Object.values(constants_1.ComputerCategory).join(", ")}`);
                }
                const computerExists = yield models_1.ComputerModel.findOne({ name: computerInput.name });
                if (computerExists) {
                    throw new ReferenceError("Computer already exists");
                }
                const computer = yield models_1.ComputerModel.create(computerInput);
                return computer;
            }
            catch (error) {
                throw new Error("Error creating computer " + error);
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.ComputerModel.find();
            }
            catch (error) {
                throw new Error("Error finding all computers " + error);
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const computer = yield models_1.ComputerModel.findById(id);
                if (!computer)
                    throw new Error("Computer not found");
                return computer.toObject();
            }
            catch (error) {
                throw new Error(`Error finding computer by id ${id} ${error}`);
            }
        });
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const computer = yield models_1.ComputerModel.findOne({ name });
                if (!computer)
                    throw new Error("Computer not found");
                return computer.toObject();
            }
            catch (error) {
                throw new Error(`Error finding computer by name ${name} ${error}`);
            }
        });
    }
    // falta revisar si funciona todo bien con la categoria con enums
    getByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.values(constants_1.ComputerCategory).includes(category)) {
                    throw new ReferenceError(`Invalid category. Allowed values: ${Object.values(constants_1.ComputerCategory).join(", ")}`);
                }
                const computers = yield models_1.ComputerModel.find({ category });
                if (!computers.length)
                    throw new Error("No computers found in this category");
                return computers;
            }
            catch (error) {
                throw new Error(`Error finding computers by category ${category} ${error}`);
            }
        });
    }
    // también falta tener en cuenta los enums en constants.ts
    update(id, computerInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const computer = yield models_1.ComputerModel.findById(id);
                if (!computer)
                    throw new Error("Computer not found");
                // Validar que la categoría sea válida si se está actualizando
                if (computerInput.category && !Object.values(constants_1.ComputerCategory).includes(computerInput.category)) {
                    throw new ReferenceError(`Invalid category. Allowed values: ${Object.values(constants_1.ComputerCategory).join(", ")}`);
                }
                // No permitir cambiar estado a "available" si actualmente está alquilado
                if (computer.status === constants_1.ComputerStatus.RENTED && computerInput.status === constants_1.ComputerStatus.AVAILABLE) {
                    throw new ReferenceError("Cannot change status to 'available' while computer is rented.");
                }
                const updatedComputer = yield models_1.ComputerModel.findByIdAndUpdate(id, computerInput, { new: true });
                return updatedComputer;
            }
            catch (error) {
                throw new Error(`Error updating computer by id ${id} ${error}`);
            }
        });
    }
    // también falta tener en cuenta los enums en constants
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const computer = yield models_1.ComputerModel.findById(id);
                if (!computer)
                    throw new Error("Computer not found");
                // Validar que el estado sea válido
                if (!Object.values(constants_1.ComputerStatus).includes(status)) {
                    throw new ReferenceError(`Invalid status. Allowed values: ${Object.values(constants_1.ComputerStatus).join(", ")}`);
                }
                // No permitir cambiar el estado de un computador alquilado
                if (computer.status === constants_1.ComputerStatus.RENTED && status !== constants_1.ComputerStatus.RENTED) {
                    throw new ReferenceError("Cannot change status of a rented computer.");
                }
                computer.status = status;
                yield computer.save();
                return computer;
            }
            catch (error) {
                throw new Error(`Error updating computer status by id ${id} ${error}`);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const computer = yield models_1.ComputerModel.findById(id);
                if (!computer)
                    throw new Error("Computer not found");
                // No permitir eliminar un computador alquilado
                if (computer.status === constants_1.ComputerStatus.RENTED) {
                    throw new ReferenceError("Cannot delete a rented computer.");
                }
                return yield models_1.ComputerModel.findByIdAndDelete(id);
            }
            catch (error) {
                throw new Error(`Error deleting computer by id ${id} ${error}`);
            }
        });
    }
}
exports.computerService = new ComputerService();
