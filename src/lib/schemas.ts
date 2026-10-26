import { z } from "zod";

export const garmentSchema = z.enum(["hoodie", "tee", "pant", "cap"]);

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  colorway: z.string(),
  price: z.number().nonnegative(),
  garment: garmentSchema,
  tone: z.enum(["bone", "wine", "ink", "gold"]),
});

export const trackSchema = z.object({
  id: z.string(),
  title: z.string(),
  scripture: z.string(),
  duration: z.string(),
});

// Lenient international format: an optional leading +, then digits with spaces, dots, dashes or
// brackets between them; 7–15 digits in total (the E.164 maximum).
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s().-]+$/, "Enter a valid phone number")
  .refine((v) => {
    const digits = v.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }, "Enter a valid phone number");

export const subscribeSchema = z.object({
  email: z.email("Enter a valid email address"),
  // Optional: an empty field is treated as not given.
  phone: z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), phoneSchema.optional()),
});

export type Garment = z.infer<typeof garmentSchema>;
export type Product = z.infer<typeof productSchema>;
export type Track = z.infer<typeof trackSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
