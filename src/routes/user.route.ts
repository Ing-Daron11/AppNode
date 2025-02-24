import  { Request, Response, Router } from 'express';
import { userController } from '../controllers';

export const userRouter = Router(); // Create a new router

userRouter.get("/", userController.get);
userRouter.post("/", userController.create);
userRouter.put("/", userController.update);
userRouter.delete("/", userController.delete);
userRouter.get("/all", userController.getAll);