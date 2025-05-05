"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const schemas_1 = require("../schemas");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/", middlewares_1.auth, (0, middlewares_1.authorizeRole)('ADMIN'), controllers_1.userController.getAll); //Protegida
exports.userRouter.post("/", middlewares_1.auth, (0, middlewares_1.authorizeRole)("ADMIN"), (0, middlewares_1.validateSchema)(schemas_1.userSchema), controllers_1.userController.create); //Protegida
exports.userRouter.get("/profile", middlewares_1.auth, controllers_1.userController.get); //No protegida
//Tuve que mover este endpoint arriba de /:id porque sino no funcionaba, 
// debido a que el endpoint /login era interpretado como un id y arrojaba el error ObjectId.
exports.userRouter.post("/login", controllers_1.userController.login); //No protegida
exports.userRouter.get("/:id", middlewares_1.auth, (0, middlewares_1.authorizeRole)("ADMIN"), controllers_1.userController.get); //Protegida
exports.userRouter.put("/:id", middlewares_1.auth, (0, middlewares_1.authorizeRole)("ADMIN"), controllers_1.userController.update); //Protegida
exports.userRouter.delete("/:id", middlewares_1.auth, (0, middlewares_1.authorizeRole)("ADMIN"), controllers_1.userController.delete); //Protegida
