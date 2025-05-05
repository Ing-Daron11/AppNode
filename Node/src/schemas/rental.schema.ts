import { object, string, number, date } from "zod";

export const rentalSchema = object({
    device: string({ required_error: "Device ID is required" })
        .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId format"), 

    user: string({ required_error: "User ID is required" })
        .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId format"), 

    quantity: number({ required_error: "Quantity is required" })
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"), 

    timeLimit: number({ required_error: "Time limit is required" })
        .int("Time limit must be an integer")
        .min(1, "Time limit must be at least 1 hour"), 

    initDate: date({ required_error: "Initial date is required" }), 

    finalDate: date({ required_error: "Final date is required" })
        .refine((val) => val > new Date(), "Final date must be in the future"),
});
