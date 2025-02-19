import mongoose from "mongoose";

export interface UserInputDTO {
    name: string; 
    email: string
    password: string
}

export interface UserDocument extends UserInputDTO, mongoose.Document{
    createdAt: Date,
    updatedAt:Date,
    deleteAt: Date
}