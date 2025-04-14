import { apiAddVarriant } from "api";
import Button from "components/common/Button";
import Loading from "components/common/Loading";
import InputForm from "components/input/InputForm";
import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import Swal from "sweetalert2";
import { getBase64 } from "utils/helpers";

const CustomVarriant = ({ customVarriant, setCustomVarriant }) => {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  useEffect(() => {
    reset({
      title: customVarriant?.title,
      price: customVarriant?.price,
      color: customVarriant?.color,
    });
  }, [customVarriant]);
  const handleAddVarriant = async (data) => {
    if (data.color === customVarriant.color)
      Swal.fire("Oops!", "Color not change", "info");
    else {
      const formData = new FormData();
      for (let i of Object.entries(data)) formData.append(i[0], i[1]);
      if (data.thumb) formData.append("thumb", data.thumb[0]);
      if (data.images) {
        for (let image of data.images) formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiAddVarriant(formData, customVarriant._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success){
        toast.success(response.mes)
        reset()
        setPreview({thumb: '', images: []})
      } else toast.error(response.mes)
    }
    
  };
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
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
      handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0)
      handlePreviewImages(watch("images"));
  }, [watch("images")]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <div className="p-4 flex justify-between items-center right-0 left-[327px]">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Custom Varriant
        </h1>
        <span
          className="text-main hover:underline cursor-pointer text-bold border-item hover:bg-gray-200"
          onClick={() => setCustomVarriant(null)}
        >
          Cancel
        </span>
      </div>
      <form className="p-4" onSubmit={handleSubmit(handleAddVarriant)}>
        <div className="flex gap-4 items-center mt-4">
          <InputForm
            label="Original name"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Need fill this field",
            }}
            styleClass="flex-auto"
            placeholder="Title of variant"
          />
        </div>
        <div className="flex gap-4 items-center mt-4">
          <InputForm
            label="Price product"
            register={register}
            errors={errors}
            id="price"
            validate={{
              required: "Need fill this field",
            }}
            styleClass="flex-auto"
            placeholder="Price of varriant"
            type="number"
            fullWidth
          />
          <InputForm
            label="Color product"
            register={register}
            errors={errors}
            id="color"
            validate={{
              required: "Need fill this field",
            }}
            styleClass="flex-auto"
            placeholder="Color of varriant"
          />
        </div>
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
              <div className="w-fit relative" key={index}>
                <img
                  src={el}
                  alt="images"
                  className="w-[200px] object-contain"
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 justify-end">
          <Button type="submit" className="flex items-center gap-2">
            {/* <FaSave/> */}
            <span>Save</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default memo(CustomVarriant);
