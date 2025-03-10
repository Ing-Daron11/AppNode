import { Timestamp } from "bson";
import mongoose from "mongoose";

export interface UserInputDTO {
    name: string; 
    email: string
    password: string
}

export interface UserInputDTOUpdate {
    name: string; 
    email: string
}

export interface UserLogin {
    email: string
    password: string
}

export interface UserResponse {
    user?:{
        email: string
        roles: string[]
        name: string
    },
    
    message: {
        contest: string,
        code: string,
    }
        
}

export interface UserDocument extends UserInputDTO, mongoose.Document{
    createdAt: Date,
    updatedAt:Date,
    deleteAt: Date
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true ,unique: true },
    password: { type: String, required: true }
}, {timestamps: true, collection: "user"});

export const UserModel = mongoose.model<UserDocument>("User", userSchema);