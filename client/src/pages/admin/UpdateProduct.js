import React, { memo, useEffect, useState, useCallback } from "react";
import { Button, InputForm, Select, MarkdownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getBase64, validate } from "utils/helpers";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { showModal } from "store/app/appSlice";
import { apiUpdateProduct, apiSyncProductEmbedding } from "api";
import withBase from "hocs/withBase";
import { useNavigate } from "react-router-dom";

const UpdateProduct = ({ editProduct, setEditProduct, dispatch }) => {
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();
  const [payload, setPayload] = useState({ description: "", infomations: "" });
  const [invalidFields, setInvalidFields] = useState([]);
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const navigate = useNavigate();

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
      description: Array.isArray(editProduct?.description)
        ? editProduct.description.join("\n")
        : editProduct?.description || "",
      infomations:
        editProduct?.infomations?.describe ||
        (typeof editProduct?.infomations === "string"
          ? editProduct.infomations
          : ""),
    });
    const existingImages = Array.isArray(editProduct?.images)
    ? editProduct.images.map((url, idx) => ({ name: `existing-${idx}`, path: url }))
    : [];
    setPreview({
      thumb: editProduct?.thumb || null,
      images: existingImages,
    });
  }, [editProduct, reset]);

  const [isFocusDescription, setIsFocusDescription] = useState(false);
  const [isFocusInfomations, setIsFocusInfomations] = useState(false);
  const changeDescription = useCallback(
    (value) => setPayload((p) => ({ ...p, description: value })),
    []
  );
  const changeInfomations = useCallback(
    (value) => setPayload((p) => ({ ...p, infomations: value })),
    []
  );

  // preview new thumb file
  const handlePreviewThumb = async (file) => {
    const base64 = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64 }));
  };

  // preview new image files
  const handlePreviewImages = async (files) => {
    const list = [];
    for (let file of files) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      list.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: list }));
  };

  // watch thumb input
  useEffect(() => {
    const file = watch("thumb")?.[0];
    if (file) handlePreviewThumb(file);
  }, [watch("thumb")]);

  // watch images input
  useEffect(() => {
    const files = watch("images");
    if (files && files.length) handlePreviewImages(files);
  }, [watch("images")]);

  const handleUpdateProduct = async (data) => {
    const invalid = validate(payload, setInvalidFields);
    if (invalid === 0) {
      if (data.category) data.category = categories?.find((el) => el.title === data.category)?.title;
      const finalPayload = { ...data, ...payload };
      console.log(finalPayload);
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      if (finalPayload.thumb) formData.append("thumb", finalPayload?.thumb?.length === 0 ? preview.thumb : finalPayload.thumb[0]);
      if (finalPayload.images) {
        const images = finalPayload?.image?.length === 0 ? preview.images : finalPayload.images
        for (let image of images) formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      try {
        const response = await apiUpdateProduct(formData);
        
        if (response.success) {
          // Tự động đồng bộ embedding sau khi cập nhật sản phẩm
          try {
            await apiSyncProductEmbedding(editProduct?._id);
            toast.success("Đã cập nhật và đồng bộ embedding cho sản phẩm");
          } catch (embeddingError) {
            console.error("Lỗi khi đồng bộ embedding:", embeddingError);
            // Không hiển thị lỗi này cho người dùng vì sản phẩm đã được cập nhật thành công
          }
          
          toast.success(response.mes);
          navigate('/admin/products');
        } else {
          toast.error(response.mes);
        }
      } catch (err) {
        toast.error("Lỗi khi cập nhật sản phẩm: " + err.message);
      } finally {
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
      }
    }
  };

  const handleRemoveImages = (name) => {
    setPreview((prev) => ({ ...prev, images: prev.images.filter((img) => img.name !== name) }));
    const files = Array.from(watch("images") || []).filter((f) => f.name !== name);
    reset({ images: files });
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
            changValue={changeDescription}
            label="Thông số sản phẩm"
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
            value={payload.description}
            setIsFocusDescription={setIsFocusDescription}
          />
          <div className="mt-6">
            <MarkdownEditor
              name="infomations"
              changValue={changeInfomations}
              label="Thông tin chi tiết sản phẩm"
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.infomations}
              setIsFocusDescription={setIsFocusInfomations}
            />
          </div>

          {/* thumbnail upload & preview */}
          <div className="mt-8">
            <label className="font-semibold">Ảnh đại diện</label>
            <input type="file" {...register("thumb")} />
            {preview.thumb && <img src={preview.thumb} alt="thumb" className="w-48 mt-2" />}
          </div>

          {/* images upload & preview */}
          <div className="mt-6">
            <label className="font-semibold">Ảnh chi tiết</label>
            <input type="file" multiple {...register("images")} />
            {preview.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {preview.images.map((el) => (
                  <div key={el.name} className="relative">
                    <img src={el.path} alt={el.name} className="w-48" />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 hover:opacity-100 cursor-pointer"
                      onClick={() => handleRemoveImages(el.name)}>
                      <FaTrash size={20} color="white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-end">
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withBase(memo(UpdateProduct));