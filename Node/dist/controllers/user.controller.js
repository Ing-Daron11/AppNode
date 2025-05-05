"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const services_1 = require("../services");
const exceptions_1 = require("../exceptions");
class Usercontroller {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield services_1.userService.create(req.body);
                res.status(201).json(newUser);
            }
            catch (error) {
                if (error instanceof ReferenceError) {
                    res.status(400).json({ message: "User already exists" });
                    return;
                }
                res.status(500).json(error);
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield services_1.userService.findById(id);
                if (user === null) {
                    res.status(404).json({ message: `User with id ${id} not found` });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield services_1.userService.findAll();
                res.json(users);
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield services_1.userService.update(id, req.body);
                if (user === null) {
                    res.status(404).json({ message: `User with id ${id} not found` });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield services_1.userService.delete(id);
                if (user === null) {
                    res.status(404).json({ message: `User with id ${id} not found` });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resObj = yield services_1.userService.login(req.body);
                res.status(200).json(resObj);
            }
            catch (error) {
                //*** Not authorized */
                if (error instanceof exceptions_1.AuthError) {
                    res.status(401).json({ message: "Not Authorized" });
                    return;
                }
                res.status(500).json(error);
            }
        });
    }
}
exports.userController = new Usercontroller();
