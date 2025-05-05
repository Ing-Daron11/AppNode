import { userSchema } from "../schemas/user.schema";

//--------------- Sad path ---------------

describe("User Schema Validations", () => {
    it("debería lanzar un error si falta el campo 'name'", () => {
        const invalidUser = {
            email: "test@example.com",
            password: "password123",
        };

        const result = userSchema.safeParse(invalidUser);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe("Name is required");
        }
    });

    it("debería lanzar un error si el email no tiene un formato válido", () => {
        const invalidUser = {
            name: "Test User",
            email: "invalid-email",
            password: "password123",
        };

        const result = userSchema.safeParse(invalidUser);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe("Not a valid email address");
        }
    });

    it("debería lanzar un error si la contraseña es demasiado corta", () => {
        const invalidUser = {
            name: "Test User",
            email: "test@example.com",
            password: "123",
        };

        const result = userSchema.safeParse(invalidUser);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe("Password  must be at least 8 characteres long");
        }
    });

    it("debería pasar si todos los campos son válidos", () => {
        const validUser = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        const result = userSchema.safeParse(validUser);
        expect(result.success).toBe(true);
    });
});