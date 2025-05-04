import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});


export const signUpSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }).nonempty({ message: "Email is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).nonempty({ message: "Password is required" }),
})
