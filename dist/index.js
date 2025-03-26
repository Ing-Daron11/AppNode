"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//let express = require("express");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const connectionDB_1 = require("./lib/connectionDB");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//rutas para los endpoints
app.use('/user', routes_1.userRouter);
app.use('/computer', routes_1.computerRouter);
app.use('/rental', routes_1.rentalRouter);
app.get("/", (req, res) => {
    res.json({ message: "¡Servidor funcionando en Vercel!" });
});
connectionDB_1.db.then(() => app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}));
exports.default = app;
