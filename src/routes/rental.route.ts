import { Router } from "express";
import { rentalController } from "../controllers";
import { auth } from "../middlewares";

export const rentalRouter = Router();

// Ruta para obtener todos los alquileres
rentalRouter.get("/", auth, rentalController.findAll);

// Ruta para crear un alquiler
// Falta validación admin
rentalRouter.post("/", auth, rentalController.create);

// Ruta para obtener un alquiler por ID
rentalRouter.get("/:id", auth, rentalController.getById);

// Ruta para actualizar un alquiler
// Falta validación admin
rentalRouter.put("/:id", auth, rentalController.update);

// Ruta para eliminar un alquiler
// Falta validación admin
rentalRouter.delete("/:id", auth, rentalController.delete);
