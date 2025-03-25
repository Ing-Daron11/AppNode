import { object, string } from "zod";

export const computerSchema = object({
    name: string({ required_error: "Name is required" }),
    category: string({ required_error: "Category is required" }),
    pricePerDay: string({ required_error: "Price per day is required" }),
});