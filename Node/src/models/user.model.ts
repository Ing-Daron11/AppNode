import mongoose from "mongoose"
import { UserInput } from "../interfaces";

export interface UserDocument extends UserInput, mongoose.Document{
    createdAt: Date, 
    updateAt: Date,
    deleteAt: Date,
    role: string
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, index: true, unique: true }, 
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["ADMIN", "USER", "TECHNICIAN"], default: "USER" },
    },{timestamps:true, collection: "users"});

export const UserModel = mongoose.model<UserDocument>("User", userSchema); 
