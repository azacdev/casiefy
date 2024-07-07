import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const SignupSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const CheckoutSchema = z.object({
  contact: z.string().min(1, "Contact is required"),
  country: z.string().min(1, "Country is required"),
  name: z.string().min(3, "Firstname required"),
  // lastname: z.string().min(3, "Lastname required"),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().min(1, "Minimum 3 characters required").optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP Code"),
});
