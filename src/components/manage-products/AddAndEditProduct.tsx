import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "../Button";
import Input from "../Input";
import { AddProductData } from "../../types/";
import { categories } from "../../helpers";
import { useAddProduct } from "../../hooks/useAddProduct";
import { useAuthContext } from "../../state/auth-context";

const fileType = ["image/png", "image/jpeg", "image/jpg"];

interface Props {
  setOpenProductForm: (open: boolean) => void;
}

const AddAndEditProduct: React.FC<Props> = ({ setOpenProductForm }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { register, handleSubmit, errors, reset } = useForm<AddProductData>();
  const {
    addNewProduct,
    loading,
    uploadProgression,
    addProductFinished,
    setUploadProgression,
    error,
  } = useAddProduct();
  const {
    authState: { authUser },
  } = useAuthContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addProductFinished) {
      reset();
      setSelectedFile(null);
      setUploadProgression(0);
    }
  }, [addProductFinished, setSelectedFile, setUploadProgression, reset]);

  const handleOpenUploadBox = () => {
    if (inputRef?.current) inputRef.current.click();
  };

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;
    const file = files[0];
    if (!fileType.includes(file.type)) {
      alert(`Wrong file format , allow only "png" or "jpeg" or "jpg"`);
      return;
    }
    setSelectedFile(file);
  };

  const handleAddProduct = handleSubmit((data) => {
    if (!selectedFile || !authUser) return;
    addNewProduct(selectedFile, data, authUser.uid);
  });

  return (
    <>
      <div className="backdrop" onClick={() => setOpenProductForm(false)}></div>
      <div className="modal modal--add-product">
        <div className="modal-close" onClick={() => setOpenProductForm(false)}>
          &times;
        </div>
        <h2 className="header--center">Add A New Product</h2>
        <form className="form" onSubmit={handleAddProduct}>
          <Input
            label="Title"
            name="title"
            placeholder="Product title"
            ref={register({
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Product title must be at least 3 characters",
              },
            })}
            error={errors.title?.message}
          ></Input>
          <Input
            label="Description"
            name="description"
            placeholder="Product description"
            ref={register({
              required: "Description is required",
              minLength: {
                value: 6,
                message: "Product description must be at least 6 characters",
              },
              maxLength: {
                value: 200,
                message:
                  "Product description must be not more than 200 characters",
              },
            })}
            error={errors.description?.message}
          ></Input>
          <Input
            label="Price"
            type="number"
            name="price"
            placeholder="Product price"
            ref={register({
              required: "Price is required",
              min: {
                value: 1,
                message: "Product price must have at  least $1",
              },
            })}
            error={errors.price?.message}
          ></Input>
          <div className="form__input-container">
            <label htmlFor="Image" className="form__input-label">
              Image
            </label>
            <div className="form__input-file-upload">
              {uploadProgression ? (
                <div style={{ width: "70%" }}>
                  <input
                    type="text"
                    className="upload-progression"
                    style={{ width: `${uploadProgression}%` }}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  name="imageFileName"
                  className="input"
                  style={{ cursor: "pointer" }}
                  onClick={handleOpenUploadBox}
                  ref={register({
                    required: "Product image is required",
                  })}
                  value={selectedFile ? selectedFile.name : ""}
                  readOnly
                />
              )}

              <Button
                width="30%"
                height="100%"
                type="button"
                style={{ borderRadius: "0", border: "1px solid #282c3499" }}
                onClick={handleOpenUploadBox}
              >
                <span className="paragraph--small">Select image</span>
              </Button>
              <input
                type="file"
                ref={inputRef}
                style={{ display: "none" }}
                onChange={handleSelectFile}
              />
            </div>

            {errors?.imageFileName && !selectedFile && (
              <p className="paragraph paragraph--error-small">
                {errors.imageFileName?.message}
              </p>
            )}
          </div>
          <div className="form__input-container">
            <label htmlFor="Category" className="form__input-label">
              Category
            </label>
            <select
              name="category"
              className="input"
              ref={register({
                required: "Product category is required.",
              })}
            >
              <option style={{ display: "none" }}></option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category?.message && (
              <p className="paragraph paragraph--error-small">
                {errors.category?.message}
              </p>
            )}
          </div>
          <Input
            label="Inventory"
            type="number"
            name="inventory"
            placeholder="Product inventory"
            ref={register({
              required: "Inventory is required",
              min: 0,
              pattern: {
                value: /^[0-9]\d*$/,
                message: "Inventory must be the positive whole number.",
              },
            })}
            error={errors.inventory?.message}
          ></Input>
          <Button
            className="btn--orange"
            width="100%"
            style={{ marginTop: "1rem" }}
            loading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </form>
        {error && <p className="paragraph paragraph--small">{error}</p>}
      </div>
    </>
  );
};

export default AddAndEditProduct;
