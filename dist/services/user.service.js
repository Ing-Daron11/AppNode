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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const models_1 = require("../models");
const exceptions_1 = require("../exceptions");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    create(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.findByEmail(userInput.email);
                if (userExists) {
                    throw new ReferenceError("User already exists");
                }
                if (userInput.password) {
                    userInput.password = yield bcrypt_1.default.hash(userInput.password, 10);
                }
                const userRole = userInput.role || "USER"; // Si no se proporciona, asigna "USER"
                if (!["ADMIN", "USER", "TECHNICIAN"].includes(userRole)) {
                    throw new Error("Invalid role");
                }
                const user = yield models_1.UserModel.create(Object.assign(Object.assign({}, userInput), { role: userRole }));
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.UserModel.findOne({ email });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.UserModel.find();
            }
            catch (error) {
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.UserModel.findById(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (userInput.role && !["ADMIN", "USER", "TECHNICIAN"].includes(userInput.role)) {
                    throw new Error("Invalid role");
                }
                //Validación extra para rehasear la password si se actualiza.
                if (userInput.password && !userInput.password.startsWith("$2b$")) {
                    userInput.password = yield bcrypt_1.default.hash(userInput.password, 10);
                }
                const user = yield models_1.UserModel.findOneAndUpdate({ _id: id }, userInput, { new: true });
                if (user)
                    user.password = "";
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield models_1.UserModel.findByIdAndDelete(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    login(userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Inicio de sesión", userLogin); //También para depurar
                const userExists = yield this.findByEmail(userLogin.email);
                if (!userExists) {
                    console.log("Usuario no encontrado"); //Depuración
                    throw new exceptions_1.AuthError("Not Authorized");
                }
                const isMatch = yield bcrypt_1.default.compare(userLogin.password, userExists.password);
                if (!isMatch) {
                    console.log("Contraseña incorrecta, pero si se encontro el usuario"); //Esta vuelta es solo para depurar
                    throw new exceptions_1.AuthError("Not Authorized");
                }
                return {
                    user: {
                        id: userExists.id,
                        name: userExists.name,
                        email: userExists.email,
                        roles: [userExists.role], // Se devuelve el rol correcto
                        token: this.generateToken(userExists)
                    }
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    generateToken(user) {
        try {
            return jsonwebtoken_1.default.sign({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role // Se incluye el rol en el token
                }
            }, process.env.JWT_SECRET || "secret", { expiresIn: "60m" });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.userService = new UserService();
