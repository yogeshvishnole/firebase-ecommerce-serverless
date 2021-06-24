import { ProductCategory, Role } from "../types";

export const isAdmin = (role: Role | null) =>
  role === "SUPER_ADMIN" || role === "ADMIN";
export const isClient = (role: Role | null) => role === "CLIENT";
export const categories: ProductCategory[] = [
  "Clothing",
  "Accessories",
  "Shoes",
  "Watches",
];
