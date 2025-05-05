//let express = require("express");
import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {userRouter, computerRouter, rentalRouter} from './routes';
import { db } from "./lib/connectionDB";
import { VercelRequest, VercelResponse } from '@vercel/node';


dotenv.config();

export const app: Express = express();
const port: number = process.env.PORT as any || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended:true }))

//rutas para los endpoints
app.use('/user', userRouter);
app.use('/computer', computerRouter);
app.use('/rental', rentalRouter)

app.get("/", (req, res) => {
    res.json({ message: "¡Servidor funcionando en Vercel!" });
});


db.then( () =>
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    } )
);

export default app;
