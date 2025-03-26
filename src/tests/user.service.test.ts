import { userService } from "../services/user.service";
import { UserModel } from "../models";
import { UserInput } from "../interfaces";
import bcrypt from "bcrypt";

// 🔹 Mockeamos el modelo de usuario de Mongoose
jest.mock("../models", () => ({
    UserModel: {
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    }
}));

describe("🧪 UserService - Pruebas Unitarias con Mocks", () => {

    //----------------------------------- Happy Tests ✅ -----------------------------------

    test("1️⃣ Crear un usuario correctamente", async () => {
        const newUser: UserInput = {
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        };

        // Mockeamos la respuesta de `findByEmail` para que no exista el usuario
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);

        // Mockeamos la respuesta de `create`
        (UserModel.create as jest.Mock).mockResolvedValue({
            ...newUser,
            _id: "mockUserId",
            role: "USER",
            password: await bcrypt.hash(newUser.password, 10)
        });

        const createdUser = await userService.create(newUser);
        expect(createdUser).toHaveProperty("_id", "mockUserId");
        expect(createdUser).toHaveProperty("email", "test@example.com");
        expect(createdUser).toHaveProperty("role", "USER");
    });

    test("2️⃣ Buscar usuario por email", async () => {
        const mockUser = { _id: "mockUserId", email: "test@example.com" };

        (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
        const user = await userService.findByEmail("test@example.com");

        expect(user).toBeDefined();
        expect(user?.email).toBe("test@example.com");
    });

    test("3️⃣ Obtener todos los usuarios", async () => {
        const mockUsers = [
            { _id: "id1", name: "User 1", email: "user1@example.com" },
            { _id: "id2", name: "User 2", email: "user2@example.com" }
        ];

        (UserModel.find as jest.Mock).mockResolvedValue(mockUsers);
        const users = await userService.findAll();

        expect(users.length).toBe(2);
        expect(users[0].name).toBe("User 1");
    });

    test("4️⃣ Actualizar usuario correctamente", async () => {
        const updatedUser = { _id: "mockUserId", name: "Updated Name", email: "test@example.com" };

        (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
        const user = await userService.update("mockUserId", { name: "Updated_Name", email: "test@example.com", role: "USER", password: "password123" });

        expect(user).toHaveProperty("name", "Updated Name");
    });

    test("5️⃣ Eliminar usuario correctamente", async () => {
        const deletedUser = { _id: "mockUserId", name: "Deleted User", email: "deleted@example.com" };

        (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedUser);
        const user = await userService.delete("mockUserId");

        expect(user).toHaveProperty("email", "deleted@example.com");
    });

    //----------------------------------- Sad Tests ❌ -----------------------------------

    test("6️⃣ No debe crear usuario si el email ya existe", async () => {
        (UserModel.findOne as jest.Mock).mockResolvedValue({ email: "test@example.com" });

        await expect(userService.create({ name: "Test", email: "test@example.com", password: "123" }))
            .rejects.toThrow("User already exists");
    });

    test("7️⃣ No debe encontrar usuario por ID si no existe", async () => {
        (UserModel.findById as jest.Mock).mockResolvedValue(null);
        const user = await userService.findById("nonexistentId");

        expect(user).toBeNull();
    });

    test("8️⃣ No debe actualizar usuario con un rol inválido", async () => {
        await expect(userService.update("mockUserId", { role: "INVALID_ROLE" } as any))
            .rejects.toThrow("Invalid role");
    });

    test("9️⃣ No debe eliminar usuario si el ID no existe", async () => {
        (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        const user = await userService.delete("nonexistentId");
        expect(user).toBeNull();
    });

});
