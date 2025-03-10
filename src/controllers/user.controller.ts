import { Request, Response } from "express";
import {UserInputDTO, UserLogin} from "../models";
import {userService} from "../service";

class UserController {
  public async create(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body as UserInputDTO);
      res.status(201).json(newUser);
      
    } catch (error) {
      if(error instanceof ReferenceError){
        res.status(400).json({error: (error as any).message});
        return;
      }
    }
    
  }
  public async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
      
    } catch (error) {
      if(error instanceof ReferenceError){
        res.status(400).json({error: (error as any).message});
        return;
      }
      
    }
   
  }

  //si se busca por email, entonces ese campo es lo unico que no se puede actualizar
  //si se busca por id, entonces todos los campos se pueden actualizar

  public async update(req: Request, res: Response) {
    try {
      const user = await userService.update(req.body as UserInputDTO);
      res.status(200).json(user);
    } catch (error) {
      if(error instanceof ReferenceError){
        res.status(400).json({error: error.message});
        return;
      }
    }
  }

  //delete
  public async delete(req: Request, res: Response) {
    try {
      const user = await userService.delete(req.body.email);
      res.status(200).json(user);
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

  public async login(req: Request, res: Response) {
    try {
      const resObj = await userService.login(req.body as UserLogin);
      res.status(200).send("User login");
    } catch (error) {
      //***Not authorized */
      res.status(500).json(error);
    }
  }
  

  

 
}

export const userController = new UserController(); // Esto me exporta la clase UserController