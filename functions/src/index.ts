import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const env = functions.config();

type ProductCategory = "Clothing" | "Shoes" | "Watches" | "Accessories";
type Product = {
  title: string;
  description: string;
  imageUrl: string;
  imageRef: string;
  imageFileName: string;
  price: number;
  category: ProductCategory;
  inventory: number;
  creator: string;
};
type Counts = {
  [key in "All" | ProductCategory]: number;
};

export const onSignup = functions.https.onCall(async (data, context) => {
  console.log("env", env);

  try {
    const { username } = data as { username: string };
    if (!context.auth?.uid) return;
    await admin.auth().setCustomUserClaims(context.auth.uid, {
      role:
        context.auth.token.email === env.admin.super_admin
          ? "SUPER_ADMIN"
          : "CLIENT",
    });

    const result = await admin
      .firestore()
      .collection("users")
      .doc(context.auth?.uid)
      .set({
        username,
        email: context.auth.token.email,
        role:
          context.auth.token.email === env.admin.super_admin
            ? "SUPER_ADMIN"
            : "CLIENT",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    if (!result) return;

    return { message: "User has been created on the firestore" };
  } catch (err) {
    throw err;
  }
});

export const onProductCreated = functions.firestore
  .document("products/{productId}")
  .onCreate(async (snapshot, context) => {
    let counts: Counts;
    const product = snapshot.data() as Product;
    // query the product-count collection
    const countsData = await admin
      .firestore()
      .collection("product-counts")
      .doc("counts")
      .get();

    if (!countsData.exists) {
      // first item
      // construct the counts object
      counts = {
        All: 1,
        Clothing: product.category === "Clothing" ? 1 : 0,
        Shoes: product.category === "Shoes" ? 1 : 0,
        Accessories: product.category === "Accessories" ? 1 : 0,
        Watches: product.category === "Watches" ? 1 : 0,
      };
    } else {
      const {
        All,
        Clothing,
        Accessories,
        Shoes,
        Watches,
      } = countsData.data() as Counts;
      counts = {
        All: All + 1,
        Clothing: product.category === "Clothing" ? Clothing + 1 : Clothing,
        Shoes: product.category === "Shoes" ? Shoes + 1 : Shoes,
        Accessories:
          product.category === "Accessories" ? Accessories + 1 : Accessories,
        Watches: product.category === "Watches" ? Watches + 1 : Watches,
      };
    }
    return admin
      .firestore()
      .collection("product-counts")
      .doc("counts")
      .set(counts);
  });

export default { onSignup };
