import { db, firebase, storageRef } from "./config";
import { UserInfo } from "../types";
import { v4 as uuidv4 } from "uuid";

export const usersRef = db.collection("users");
export const productsRef = db.collection("products");
export const productCountsRef = db.collection("product-counts");
export const productImagesFolder = "products";

export const snapshotToUserInfo = (
  doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
) => {
  const docData = doc.data() as Omit<UserInfo, "id">;
  const userInfo: UserInfo = {
    id: doc.id,
    ...docData,
  };
  return userInfo;
};

export const createImageRef = (imageName: string) => {
  const uuid = uuidv4();
  return storageRef.child(`${productImagesFolder}/${imageName}-${uuid}`);
};
