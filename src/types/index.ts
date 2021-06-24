import { firebase } from "../firebase/config";

export type AuthUser = firebase.User;

export type SignupData = {
  username: string;
  email: string;
  password: string;
};

export type Provider = "facebook" | "google";

export type Role = "SUPER_ADMIN" | "CLIENT" | "ADMIN";

export type Address = {
  index?: number;
  fullname: string;
  address1: string;
  address2?: string;
  city: string;
  zipCode: string;
  phone: string;
};

export type UserInfo = {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: firebase.firestore.Timestamp;
  shippingAddresses?: Address[];
  stripeCustomerId?: string;
  updatedAt?: firebase.firestore.Timestamp;
};

export type ProductTab = "All" | ProductCategory;
export type ProductCategory = "Clothing" | "Shoes" | "Watches" | "Accessories";

export type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageRef: string;
  imageFileName: string;
  price: number;
  category: ProductCategory;
  inventory: number;
  creator: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
};

export type AddProductData = Pick<
  Product,
  "title" | "description" | "category" | "imageFileName" | "inventory" | "price"
>;

// product type used to upload a document in firestore
export type UploadProduct = Omit<Product, "id" | "createdAt"> & {
  createdAt: firebase.firestore.FieldValue;
};

export type Counts = {
  [key in "All" | ProductCategory]: number;
};
