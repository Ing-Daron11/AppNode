import { Request, Response } from "express";
import {UserInputDTO} from "../models";
import {userService} from "../service";

class UserController {
  public async create(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body as UserInputDTO);
      res.status(201).json(newUser);
      
    } catch (error) {
      if(error instanceof ReferenceError){
        res.status(400).json({error: error.message});
        return;
      }
    }
    
  }

  public get(req: Request, res: Response) {
    res.status(200).send("User get");
  }

  public update(req: Request, res: Response) {
    res.status(200).send("User updated");
  }

  public delete(req: Request, res: Response) {
    res.status(200).send("User deleted");
  }

  public getAll(req: Request, res: Response) {
    res.status(200).send("User get all");
  }
}

export const userController = new UserController(); // Esto me exporta la clase UserController