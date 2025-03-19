import { UserInputDTO, UserDocument, UserModel, UserLogin, UserResponse, UserInputDTOUpdate } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


class UserService{

    //Create 
    public async create(userInputDTO: UserInputDTO): Promise<UserDocument> {
        try {
            //esto es lo que puede devolver la funcion (UserDocument | null)
           const userExits: UserDocument | null = await this.findbyEmail(userInputDTO.email);
           if(userExits != null){
               throw new ReferenceError("User already exists");
           }
           userInputDTO.password = await bcrypt.hash(userInputDTO.password, 10);


           const user: UserDocument = await UserModel.create(userInputDTO);

            return user;

        } catch (error) {
            throw error;
            
        }
    }

    //Get All
    public async getAll(): Promise<UserDocument[]> {
        try {
            const users: UserDocument[] = await UserModel.find();
            return users;
        } catch (error) {
            throw error;
            
        }
    }
    
    //Update
    public async update(userInputDTO: UserInputDTOUpdate): Promise<UserDocument | null>{
        try {
            const user = await this.findbyEmail(userInputDTO.email);
            if(user == null){
                return null;
            }
            user.set(userInputDTO);
            await user.save();
            return user;
        } catch (error) {
            if(error instanceof ReferenceError){
                throw new ReferenceError("User not found");
            }
            return null;   
        }
    }

    //delete
    public async delete(email: string): Promise<UserDocument | null>{
        try {
            const user = await this.findbyEmail(email);
            if(user == null){
                return null;
            }
            await user.deleteOne();
            return user;
        } catch (error) {
            if(error instanceof ReferenceError){
                throw new ReferenceError("User not found");
            }
            return null;
        }  
    }



// ----------------- Metodos auxiliares -----------------
    public async findbyEmail(email: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findOne({email});
            return user;
        } catch (error) {
            throw error;
            
        }
    }

    //Login
    public async login(userLogin: UserLogin): Promise<UserResponse | undefined>{
        try {
            const usrerExis: UserDocument | null = await this.findbyEmail(userLogin.email);
            if (usrerExis == null){
                throw new ReferenceError("User not authorized");
            }
            
            const isPasswordValid: boolean = await bcrypt.compare(userLogin.password, usrerExis.password);
                return{
                    user:{
                        name: usrerExis.name || '',
                        email: usrerExis.email,
                        roles: ["admin"],
                        token: this.generateToken(usrerExis.email)
                    },
                    message:{
                        contest: "Autorizado!",
                        code: "200"
                    }
                }
            
           
            
        } catch (error) {
            
        }
    }


    public generateToken(email: string): string{
        try {
            return jwt.sign({user: {email}}, process.env.JWT_SECRET || "secret", 
                {expiresIn: "10m"});
        } catch (error) {
            throw new Error("Token generation failed");
        }
    }
        


}



export const userService = new UserService();
