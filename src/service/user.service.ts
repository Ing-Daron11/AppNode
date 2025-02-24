import { UserInputDTO, UserDocument, UserModel } from "../models";
import bcrypt from "bcrypt";
class UserService{

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

    public async findbyEmail(email: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findOne({email});
            return user;
        } catch (error) {
            throw error;
            
        }
    }

}

export const userService = new UserService();
