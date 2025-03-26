"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputerStatus = exports.ComputerCategory = void 0;
var ComputerCategory;
(function (ComputerCategory) {
    ComputerCategory["GAMER"] = "Gamer";
    ComputerCategory["OFFICE"] = "Office";
    ComputerCategory["DESIGN"] = "Design";
    ComputerCategory["SERVER"] = "Server";
})(ComputerCategory || (exports.ComputerCategory = ComputerCategory = {}));
var ComputerStatus;
(function (ComputerStatus) {
    ComputerStatus["AVAILABLE"] = "Available";
    ComputerStatus["RENTED"] = "Rented";
    ComputerStatus["MAINTENANCE"] = "Maintenance";
})(ComputerStatus || (exports.ComputerStatus = ComputerStatus = {}));
