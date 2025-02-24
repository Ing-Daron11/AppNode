import { Request, Response } from "express";
import {UserModel, UserInputDTO} from "../models";

class UserController {
  public async create(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body as UserInputDTO);
      res.status(201).json(newUser);
      
    } catch (error) {
      res.status(500).json({error});
  
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