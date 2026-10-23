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

export const subscribeSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export type Garment = z.infer<typeof garmentSchema>;
export type Product = z.infer<typeof productSchema>;
export type Track = z.infer<typeof trackSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
