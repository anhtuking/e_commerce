import React, { useCallback, useEffect, useState } from "react";
import { Button, InputForm, Select, MarkdownEditor } from "components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getBase64, validate } from "utils/helpers";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { apiCreateProduct } from "api";

const CreateProduct = () => {
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const [payload, setPayload] = useState({
    description: "",
  });
  const [hoverEl, setHoverEl] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });

  const changValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      console.log(file.type);
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  useEffect(() => {
    const thumbFile = watch("thumb")?.[0];
    if (thumbFile) {
      handlePreviewThumb(thumbFile);
    } else {
      setPreview((prev) => ({ ...prev, thumb: null }));
    }
  }, [watch("thumb")]);

  useEffect(() => {
    const images = watch("images");
    if (images && images.length > 0) {
      handlePreviewImages(images);
    } else {
      setPreview((prev) => ({ ...prev, images: [] }));
    }
  }, [watch("images")]);

  const handleCreateProduct = async (data) => {
    const invalid = validate(payload, setInvalidFields);
    if (invalid === 0) {
      if (data.category)
        data.category = categories?.find( el => el._id === data.category )?.title;
      const finalPayload = { ...data, ...payload };
      console.log(finalPayload);
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      if (finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0])
      if (finalPayload.images){
        for (let image of finalPayload.images) formData.append('images', image)
      }
      const response = await apiCreateProduct(formData)
      console.log(response);
    }
  };

  const handleRemoveImages = (name) => {
    const files = [...watch('images')]
    reset ({
      images: files?.filter(el => el.name !== name)
    })
    if (preview.images?.some((el) => el.name === name))
      setPreview((prev) => ({
        ...prev,
        images: prev.images?.filter((el) => el.name !== name),
      }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Product</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg px-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label={"Name product"}
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
            }}
            fullWidth
            placeholder="Name of new product"
          />
          <div className="w-full flex gap-4 my-6">
            <InputForm
              label={"Price"}
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Need fill this field",
              }}
              styleClass="flex-auto"
              placeholder="Price of new product"
              type="number"
              fullWidth
            />
            <InputForm
              label={"Quantity"}
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Need fill this field",
              }}
              styleClass="flex-auto"
              placeholder="Quantity of new product"
              type="number"
              fullWidth
            />
            <InputForm
              label={"Color"}
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Need fill this field",
              }}
              styleClass="flex-auto"
              placeholder="Color of new product"
            />
          </div>
          <div className="w-full flex gap-4 my-6">
            <Select
              label="Category"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.title,
              }))}
              register={register}
              id="category"
              validate={{
                required: "Need fill this field",
              }}
              errors={errors}
              styleClass="flex-auto"
            />
            <Select
              label="Brand"
              options={categories
                ?.find((el) => el._id === watch("category"))
                ?.brand?.map((el) => ({
                  code: el,
                  value: el,
                }))}
              register={register}
              id="brand"
              validate={{
                required: "Need fill this field",
              }}
              errors={errors}
              styleClass="flex-auto"
            />
          </div>
          <MarkdownEditor
            name="description"
            changValue={changValue}
            label="Description"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">
              Upload thumb
            </label>
            <input
              type="file"
              id="thumb"
              {...register("thumb", { required: "Need fill this field" })}
            />
            {errors?.["thumb"] && (
              <small className="text-xs text-red-500">
                {errors["thumb"]?.message}
              </small>
            )}
          </div>
          {preview.thumb && (
            <div className="my-4">
              <img
                src={preview.thumb}
                alt="thumbnail"
                className="w-[200px] object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="images">
              Upload images of product
            </label>
            <input
              multiple
              type="file"
              id="images"
              {...register("images", { required: "Need fill this field" })}
            />
            {errors?.["images"] && (
              <small className="text-xs text-red-500">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preview.images.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {preview.images?.map((el, index) => (
                <div
                  className="w-fit relative"
                  key={index}
                  onMouseEnter={() => setHoverEl(el.name)}
                  onMouseLeave={() => setHoverEl(null)}
                >
                  <img
                    src={el.path}
                    alt="images"
                    className="w-[200px] object-contain"
                  />
                  {hoverEl === el.name && (
                    <div
                      className="absolute inset-0 bg-overlay flex items-center justify-center cursor-pointer"
                      onClick={() => handleRemoveImages(el.name)}
                    >
                      <FaTrash size={25} color="red" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <Button type="submit">Save product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
