import { UserDocument, UserModel } from "../models";
import { UserInput, UserInputUpdate, UserLogin, UserLoginResponse } from "../interfaces";
import { AuthError } from "../exceptions";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {

    public async create(userInput: UserInput): Promise<UserDocument> {
        try {
            const userExists: UserDocument | null = await this.findByEmail(userInput.email);
            if (userExists) {
                throw new ReferenceError("User already exists");
            }

            if (userInput.password) {
                userInput.password = await bcrypt.hash(userInput.password, 10);
            }

            const userRole = (userInput as any).role || "USER";  // Si no se proporciona, asigna "USER"

            if (!["ADMIN", "USER", "TECHNICIAN"].includes(userRole)) {
                throw new Error("Invalid role");
            }

            const user: UserDocument = await UserModel.create({ ...userInput, role: userRole });
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    public async findAll(): Promise<UserDocument[]> {
        try {
            return await UserModel.find();
        } catch (error) {
            throw error;
        }
    }

    public async findById(id: string): Promise<UserDocument | null> {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    public async update(id: string, userInput: UserInputUpdate): Promise<UserDocument | null> {
        try {
            if (userInput.role && !["ADMIN", "USER", "TECHNICIAN"].includes(userInput.role)) {
                throw new Error("Invalid role");
            }

            //Validación extra para rehasear la password si se actualiza.
            if (userInput.password && !userInput.password.startsWith("$2b$")) {
                userInput.password = await bcrypt.hash(userInput.password, 10);
            }

            const user: UserDocument | null = await UserModel.findOneAndUpdate(
                { _id: id },
                userInput,
                { new: true }
            );

            if (user) 
                user.password = "";
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<UserDocument | null> {
        try {
            return await UserModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    public async login(userLogin: UserLogin): Promise<UserLoginResponse | undefined> {
        try {
            console.log("Inicio de sesión", userLogin); //También para depurar
            const userExists: UserDocument | null = await this.findByEmail(userLogin.email);
            if (!userExists) {
                console.log("Usuario no encontrado"); //Depuración
                throw new AuthError("Not Authorized");
            }

            const isMatch: boolean = await bcrypt.compare(userLogin.password, userExists.password);
            if (!isMatch) {
                console.log("Contraseña incorrecta, pero si se encontro el usuario"); //Esta vuelta es solo para depurar
                throw new AuthError("Not Authorized");
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
        } catch (error) {
            throw error;
        }
    }

    public generateToken(user: UserDocument): string {
        try {
            return jwt.sign(
                {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role // Se incluye el rol en el token
                    }
                },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "60m" }
            );
        } catch (error) {
            throw error;
        }
    }
}

export const userService = new UserService();
