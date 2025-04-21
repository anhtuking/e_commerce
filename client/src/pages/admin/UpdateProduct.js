import React, { memo, useEffect, useState, useCallback } from "react";
import { Button, InputForm, Select, MarkdownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { getBase64, validate } from "utils/helpers";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { showModal } from "store/app/appSlice";
import { apiUpdateProduct } from "api";

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
  const { categories } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
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

  useEffect(() => {
    reset({
      title: editProduct?.title || "",
      price: editProduct?.price || "",
      quantity: editProduct?.quantity || "",
      color: editProduct?.color || "",
      category: editProduct?.category || "",
      brand: editProduct?.brand?.toLowerCase() || "",
    });
    setPayload({
      description:
        typeof editProduct?.description === "object"
          ? editProduct?.description?.join(", ")
          : editProduct?.description,
    });
    setPreview({
      thumb: editProduct?.thumb || "",
      images: editProduct?.images || [],
    });
  }, [editProduct, reset]);
  
  const [isFocusDescription, setIsFocusDescription] = useState(false);

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
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push(base64);
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

//   useEffect(() => {
//     if (watch("thumb") instanceof FileList && watch('thumb').length > 0)
//         handlePreviewThumb(watch("thumb")[0])
//   }, [watch("thumb")]);

//   useEffect(() => {
//     if (watch("images") instanceof FileList && watch('images').length > 0) 
//         handlePreviewImages(watch("images"))
//   }, [watch("images")]);

  const handleUpdateProduct = async (data) => {
    const invalid = validate(payload, setInvalidFields);
    if (invalid === 0) {
      if (data.category) data.category = categories?.find( (el) => el.title === data.category )?.title;
      const finalPayload = { ...data, ...payload};
      console.log(finalPayload);
      const formData = new FormData(); 
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      if (finalPayload.thumb) formData.append("thumb", finalPayload?.thumb?.length === 0 ? preview.thumb : finalPayload.thumb[0]);
      if (finalPayload.images) {
        const images = finalPayload?.image?.length === 0 ? preview.images : finalPayload.images
        for (let image of images) formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateProduct(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      console.log(response);
    //   if (response.success) {
    //     toast.success(response.mes);
    //     reset();
    //     setPayload({
    //       thumb: "",
    //       image: [],
    //     });
    //   } else toast.error(response.mes);
    }
  };

  const handleRemoveImages = (name) => {
    const files = [...watch("images")];
    reset({
      images: files?.filter((el) => el.name !== name),
    });
    if (preview.images?.some((el) => el.name === name))
      setPreview((prev) => ({
        ...prev,
        images: prev.images?.filter((el) => el.name !== name),
      }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <div className="p-4 flex justify-between items-center right-0 left-[327px]">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Chỉnh sửa sản phẩm</h1>  
        <span className="text-main hover:underline cursor-pointer text-bold border-item hover:bg-gray-200" onClick={() => setEditProduct(null)}>Hủy</span>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg px-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label={"Name product"}
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
            }}
            fullWidth
            placeholder="Tên sản phẩm"
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
              placeholder="Giá sản phẩm"
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
              placeholder="Số lượng sản phẩm"
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
              placeholder="Màu sắc sản phẩm"
            />
          </div>
          <div className="w-full flex gap-4 my-6">
            <Select
              label="Danh mục"
              options={categories?.map((el) => ({
                code: el.title,
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
              label="Thương hiệu"
              options={categories
                ?.find((el) => el.title === watch("category"))
                ?.brand?.map((el) => ({
                  code: el.toLowerCase(),
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
            label="Mô tả"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            value={payload.description}
            setIsFocusDescription={setIsFocusDescription}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">
              Tải ảnh sản phẩm
            </label>
            <input
              type="file"
              id="thumb"
              {...register("thumb")}
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
              Tải ảnh sản phẩm
            </label>
            <input
              multiple
              type="file"
              id="images"
              {...register("images")}
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
            <Button type="submit">Lưu sản phẩm</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);
