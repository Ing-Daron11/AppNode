//let express = requier('express');
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route"; // Ensure that the file './routes/user.route.ts' exists
dotenv.config();


import { db } from "./lib/connectionDB"; // Ensure that the file './lib/connectionDB.ts' exists

const app: Express = express();
const port: number = (process.env.PORT as any) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/err", (req: Request, res: Response) => {
  res.status(500).send("Something broke! error 500");
});

app.get("/err2", (req: Request, res: Response) => {
  res.status(404).send("Not found! error 404");
});

app.get("/err3", (req: Request, res: Response) => {
  res.status(403).send("Forbbiden! error 403");
});

db.then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => console.log(error));

