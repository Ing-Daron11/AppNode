import { Request, Response, Router } from "express";
import { computerController } from "../controllers";
import { computerSchema } from "../schemas";
import { auth, validateSchema } from "../middlewares";

                                                                                                                                                                                                                              
export const computerRouter = Router();

// Ruta para crear un computador
// falta validación admin
computerRouter.post("/", auth, validateSchema(computerSchema), computerController.create);
// Ruta para obtener todos los computadores
computerRouter.get("/", auth, computerController.findAll);
// Ruta para obtener un computador por id
computerRouter.get("/:id", auth, computerController.getById);
// Ruta para obtener computadores por categoría
computerRouter.get("/category/:category", auth, computerController.getByCategory);
// Ruta para actualizar un computador
// falta validación admin
computerRouter.put("/:id", auth, computerController.update);
// Ruta para actualizar el estado de un computador
// falta validación admin
computerRouter.patch("/:id/status", auth, computerController.updateStatus);
// Ruta para eliminar un computador
// falta validación admin
computerRouter.delete("/:id", auth, computerController.delete);