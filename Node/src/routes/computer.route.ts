import { Router } from "express";
import { computerController } from "../controllers";
import { computerSchema } from "../schemas";
import { auth, validateSchema, authorizeRole } from "../middlewares";

export const computerRouter = Router();

// Ruta para obtener todos los computadores
computerRouter.get("/", auth, computerController.findAll);

// Ruta para crear un computador
// Falta validación admin
computerRouter.post("/", auth, computerController.create);

// Ruta para obtener un computador por ID
computerRouter.get("/:id", auth, computerController.getById);

// Ruta para obtener computadores por categoría
computerRouter.get("/category/:category", auth, computerController.getByCategory);

// Ruta para actualizar un computador
// Falta validación admin
computerRouter.put("/:id", auth, authorizeRole('ADMIN'), computerController.update);

// Ruta para actualizar el estado de un computador
// Falta validación admin
computerRouter.patch("/:id/status", auth, authorizeRole('ADMIN'), computerController.updateStatus);

// Ruta para eliminar un computador
// Falta validación admin
computerRouter.delete("/:id", auth, authorizeRole('ADMIN'), computerController.delete);
