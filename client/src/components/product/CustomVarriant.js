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
      
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiAddVarriant(formData, customVarriant._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success){
        toast.success(response.mes)
        reset()
        setPreview({thumb: ''})
        setCustomVarriant(null)
      } else toast.error(response.mes)
    }
    
  };
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
      handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="p-4 flex justify-between items-center border-b">
          <h1 className="text-xl font-bold text-gray-800">
            Biến thể sản phẩm
          </h1>
          <button
            onClick={() => setCustomVarriant(null)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="p-4" onSubmit={handleSubmit(handleAddVarriant)}>
          <div className="flex gap-4 items-center mt-2">
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
          <div className="flex flex-col gap-2 mt-6">
            <label className="font-semibold" htmlFor="thumb">
              Upload thumb
            </label>
            <input
              type="file"
              id="thumb"
              {...register("thumb", { required: "Need fill this field" })}
              className="border p-2 rounded"
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
                className="w-[120px] h-[120px] object-contain border rounded"
              />
            </div>
          )}
          <div className="flex items-center gap-2 justify-end mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => setCustomVarriant(null)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <Button type="submit" className="flex items-center gap-2">
              <span>Save</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(CustomVarriant);
