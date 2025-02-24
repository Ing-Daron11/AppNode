import { UserInputDTO, UserDocument, UserModel } from "../models";
class UserService{

    public async create(userInputDTO: UserInputDTO): Promise<UserDocument> {
        try {
            //esto es lo que puede devolver la funcion (UserDocument | null)
           const userExits: UserDocument | null = await this.findbyEmail(userInputDTO.email);
           if(userExits){
               throw new Error("User already exits");
           }

        } catch (error) {
            
        }
    }

    public async findbyEmail(emaiñ: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findOne(email);
            return user;
        } catch (error) {
            throw error;
            
        }
    }

}

export const userService = new UserService();
