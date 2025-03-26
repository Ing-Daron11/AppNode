"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computerRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
exports.computerRouter = (0, express_1.Router)();
// Ruta para obtener todos los computadores
exports.computerRouter.get("/", middlewares_1.auth, controllers_1.computerController.findAll);
// Ruta para crear un computador
// Falta validación admin
exports.computerRouter.post("/", middlewares_1.auth, controllers_1.computerController.create);
// Ruta para obtener un computador por ID
exports.computerRouter.get("/:id", middlewares_1.auth, controllers_1.computerController.getById);
// Ruta para obtener computadores por categoría
exports.computerRouter.get("/category/:category", middlewares_1.auth, controllers_1.computerController.getByCategory);
// Ruta para actualizar un computador
// Falta validación admin
exports.computerRouter.put("/:id", middlewares_1.auth, controllers_1.computerController.update);
// Ruta para actualizar el estado de un computador
// Falta validación admin
exports.computerRouter.patch("/:id/status", middlewares_1.auth, controllers_1.computerController.updateStatus);
// Ruta para eliminar un computador
// Falta validación admin
exports.computerRouter.delete("/:id", middlewares_1.auth, controllers_1.computerController.delete);
