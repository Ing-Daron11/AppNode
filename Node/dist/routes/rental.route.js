"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.rentalRouter = (0, express_1.Router)();
// Ruta para obtener todos los alquileres
exports.rentalRouter.get("/", middlewares_1.auth, controllers_1.rentalController.findAll);
// Ruta para crear un alquiler
// Falta validación admin
exports.rentalRouter.post("/", middlewares_1.auth, controllers_1.rentalController.create);
// Ruta para obtener un alquiler por ID
exports.rentalRouter.get("/:id", middlewares_1.auth, controllers_1.rentalController.getById);
// Ruta para actualizar un alquiler
// Falta validación admin
exports.rentalRouter.put("/:id", middlewares_1.auth, controllers_1.rentalController.update);
// Ruta para eliminar un alquiler
// Falta validación admin
exports.rentalRouter.delete("/:id", middlewares_1.auth, controllers_1.rentalController.delete);
