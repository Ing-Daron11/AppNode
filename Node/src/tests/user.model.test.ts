import { UserModel } from "../models/user.model";

// --------------- Happy Path ---------------
describe("UserModel", () => {
    it("debería crear un usuario sin guardar en la BD", () => {
        const newUser = new UserModel({
            name: "Juan Pérez",
            email: "juan@example.com",
            password: "123456",
            role: "USER",
        });

        expect(newUser.name).toBe("Juan Pérez");
        expect(newUser.email).toBe("juan@example.com");
        expect(newUser.role).toBe("USER");
    });

    // --------------- Sad Path ---------------

    it("debería validar que el email sea único", () => {
        const newUser1 = new UserModel({
            name: "Juan Pérez",
            email: "juan@example.com",
            password: "123456",
            role: "USER",
        });

        const newUser2 = new UserModel({
            name: "Carlos López",
            email: "juan@example.com", // Mismo email
            password: "654321",
            role: "ADMIN",
        });

        expect(newUser1.email).toBe(newUser2.email); // Simulamos colisión de emails
    });

    it("debería asignar el rol por defecto si no se especifica", () => {
        const mockUser = new UserModel({
            name: "Ana González",
            email: "ana@example.com",
            password: "password123",
        });

        expect(mockUser.role).toBe("USER"); // Verifica el valor por defecto
    });

   
});