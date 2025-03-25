import { Request, Response, Router } from "express";
import { computerController } from "../controllers";
import { auth } from "../middlewares";

                                                                                                                                                                                                                              
const router = Router();

// Ruta para crear un computador
// falta validación admin
router.post("/", auth, computerController.create);
// Ruta para obtener todos los computadores
router.get("/", auth, computerController.findAll);
// Ruta para obtener un computador por id
router.get("/:id", auth, computerController.getById);
// Ruta para obtener computadores por categoría
router.get("/category/:category", auth, computerController.getByCategory);
// Ruta para actualizar un computador
// falta validación admin
router.put("/:id", auth, computerController.update);
// Ruta para actualizar el estado de un computador
// falta validación admin
router.patch("/:id/status", auth, computerController.updateStatus);
// Ruta para eliminar un computador
// falta validación admin
router.delete("/:id", auth, computerController.delete);