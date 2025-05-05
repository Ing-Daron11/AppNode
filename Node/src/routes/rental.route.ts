import { Router } from "express";
import { rentalController } from "../controllers";
import { auth, authorizeRole } from "../middlewares";

export const rentalRouter = Router();

// Ruta para obtener todos los alquileres
rentalRouter.get("/", auth, rentalController.findAll);

// Ruta para crear un alquiler
// Falta validación admin
rentalRouter.post("/", auth, authorizeRole('ADMIN'), rentalController.create);

// Ruta para obtener un alquiler por ID
rentalRouter.get("/:id", auth, rentalController.getById);

// Ruta para actualizar un alquiler
// Falta validación admin
rentalRouter.put("/:id", auth, authorizeRole('ADMIN'), rentalController.update);

// Ruta para eliminar un alquiler
// Falta validación admin
rentalRouter.delete("/:id", auth, authorizeRole('ADMIN'), rentalController.delete);
