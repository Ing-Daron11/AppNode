import { Request, Response } from "express";

class UserController {
  public create(req: Request, res: Response) {
    res.status(201).send("User created");
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