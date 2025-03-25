import { Router } from "express";
import { userController } from "../controllers";
import { auth, validateSchema, authorizeRole } from "../middlewares";
import { userSchema } from "../schemas";

export const userRouter = Router();

userRouter.get("/", auth, authorizeRole("ADMIN"), userController.getAll); //Protegida
userRouter.post("/", auth, authorizeRole("ADMIN") ,validateSchema(userSchema),userController.create); //Protegida
userRouter.get("/profile", auth, userController.get); //No protegida
//Tuve que mover este endpoint arriba de /:id porque sino no funcionaba, 
// debido a que el endpoint /login era interpretado como un id y arrojaba el error ObjectId.
userRouter.post("/login", userController.login); //No protegida
userRouter.get("/:id", auth, authorizeRole("ADMIN"), userController.get); //Protegida
userRouter.put("/:id", auth, authorizeRole("ADMIN"), userController.update); //Protegida
userRouter.delete("/:id", auth, authorizeRole("ADMIN"), userController.delete); //Protegida
