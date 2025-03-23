import { Request, Response, Router } from "express";
import { userController } from "../controllers";
import { auth, validateSchema } from "../middlewares";
import { userSchema } from "../schemas";

export const userRouter = Router();

userRouter.get("/", userController.getAll);
userRouter.post("/",validateSchema(userSchema),userController.create);
userRouter.get("/profile", auth, userController.get);
//Tuve que mover este endpoint arriba de /:id porque sino no funcionaba, 
// debido a que el endpoint /login era interpretado como un id y arrojaba el error ObjectId.
userRouter.post("/login", userController.login);

userRouter.get("/:id", userController.get);
userRouter.put("/:id", userController.update);
userRouter.delete("/:id",userController.delete);


/*
userRouter.get("/", (req: Request, res: Response) => {
    res.send("Get all users");
})*/
