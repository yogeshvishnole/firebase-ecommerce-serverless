import { useState } from "react";
import { AddProductData, Counts } from "../types";
import { useAsyncCall } from "./useAsyncCall";
import { createImageRef, productsRef, productCountsRef } from "../firebase/";
import { firebase } from "../firebase/config";

export const useAddProduct = () => {
  const [uploadProgression, setUploadProgression] = useState(0);
  const [addProductFinished, setAddProductFinished] = useState(false);
  const { loading, setLoading, error, setError } = useAsyncCall();

  const addNewProduct = (
    image: File,
    data: AddProductData,
    creator: string
  ) => {
    const { title, description, category, price, inventory } = data;

    setLoading(true);
    setAddProductFinished(false);
    // 1. Upload an image to firebase storage and get back a URL
    const imageRef = createImageRef(image.name);
    const uploadTask = imageRef.put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progression = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadProgression(progression);
      },
      (err) => {
        // err case
        setError(err.message);
        setLoading(false);
      },
      () => {
        // success case
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((imageUrl) => {
            // 2. create a product document inside firestore with product data and the image url

            const newProduct = {
              title,
              description,
              price: +price,
              inventory: +inventory,
              category,
              imageUrl,
              imageFileName: image.name,
              imageRef: imageRef.fullPath,
              creator,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };

            productsRef
              .add(newProduct)
              .then(async (docRef) => {
                try {
                  const newProductRef = await docRef.get();
                  const product = newProductRef.data();

                  let counts: Counts;
                  const countsData = await productCountsRef.doc("counts").get();
                  //////////////////////////////////////////////////////////

                  if (!countsData.exists) {
                    // first item
                    // construct the counts object
                    counts = {
                      All: 1,
                      Clothing: product?.category === "Clothing" ? 1 : 0,
                      Shoes: product?.category === "Shoes" ? 1 : 0,
                      Accessories: product?.category === "Accessories" ? 1 : 0,
                      Watches: product?.category === "Watches" ? 1 : 0,
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
                      Clothing:
                        product?.category === "Clothing"
                          ? Clothing + 1
                          : Clothing,
                      Shoes: product?.category === "Shoes" ? Shoes + 1 : Shoes,
                      Accessories:
                        product?.category === "Accessories"
                          ? Accessories + 1
                          : Accessories,
                      Watches:
                        product?.category === "Watches" ? Watches + 1 : Watches,
                    };
                  }
                  await productCountsRef.doc("counts").set(counts);
                } catch (err) {
                  const { message } = err as { message: string };
                  setError(message);
                  setLoading(false);
                  return;
                }

                //////////////////////////////////////////////////////////////

                setLoading(false);
                setAddProductFinished(true);
              })
              .catch((err) => {
                const { message } = err as { message: string };
                setError(message);
                setLoading(false);
              });
          })
          .catch((err) => {
            const { message } = err as { message: string };
            setError(message);
            setLoading(false);
          });
      }
    );
  };
  return {
    addNewProduct,
    uploadProgression,
    addProductFinished,
    loading,
    error,
    setUploadProgression,
  };
};
