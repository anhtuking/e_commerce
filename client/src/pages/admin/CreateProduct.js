import React, { useCallback, useEffect, useState } from "react";
import { Button, InputForm, Select, MarkdownEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { apiCreateProduct, apiSyncProductEmbedding } from "api";
import { showModal } from "store/app/appSlice";

const CreateProduct = () => {
  const { categories } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  // Holds markdown values
  const [payload, setPayload] = useState({ description: "", infomations: "" });
  const [preview, setPreview] = useState({ thumb: null, images: [] });
  const [hoverEl, setHoverEl] = useState(null);
  const [isFocusDescription, setIsFocusDescription] = useState(false);
  const [isFocusInfomations, setIsFocusInfomations] = useState(false);

  // MarkdownEditor change handlers
  const changeDescription = (value) => {
    console.log("💬 Nội dung mô tả (description):", value);
    setPayload((prev) => ({ ...prev, description: value }));
  };

  const changeInfomations = (value) => {
    console.log("📘 Nội dung chi tiết (infomations):", value);
    setPayload((prev) => ({ ...prev, infomations: value }));
  };

  const handlePreviewThumb = async (file) => {
    const base64 = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64 }));
  };

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

  useEffect(() => {
    const thumbFile = watch("thumb")?.[0];
    if (thumbFile) handlePreviewThumb(thumbFile);
    else setPreview((prev) => ({ ...prev, thumb: null }));
  }, [watch("thumb")]);

  useEffect(() => {
    const imgs = watch("images");
    if (imgs && imgs.length) handlePreviewImages(imgs);
    else setPreview((prev) => ({ ...prev, images: [] }));
  }, [watch("images")]);

  const handleCreateProduct = async (data) => {
    if (!payload.description) {
      toast.warning("Vui lòng điền mô tả sản phẩm");
      return;
    }
    if (!payload.infomations) {
      toast.warning("Vui lòng điền thông tin chi tiết sản phẩm");
      return;
    }

    if (data.category) {
      data.category = categories.find((c) => c._id === data.category)?.title;
    }

    const finalPayload = {
      ...data,
      description: [payload.description],
      infomations: { describe: payload.infomations },
    };

    console.log("📦 Payload gửi đi:", finalPayload);

    const formData = new FormData();
    Object.entries(finalPayload).forEach(([key, value]) => {
      if (key === "description" || key === "infomations") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const thumbFile = watch("thumb")?.[0];
    if (thumbFile) formData.append("thumb", thumbFile);
    const imageFiles = watch("images");
    if (imageFiles && imageFiles.length) {
      Array.from(imageFiles).forEach((file) => formData.append("images", file));
    }

    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    try {
      const response = await apiCreateProduct(formData);
      
      if (response.success) {
        // Tự động đồng bộ embedding cho sản phẩm mới
        try {
          await apiSyncProductEmbedding(response.createdProduct._id);
          toast.success("Đã tạo và đồng bộ embedding cho sản phẩm mới");
        } catch (embeddingError) {
          console.error("Lỗi khi đồng bộ embedding:", embeddingError);
          // Không hiển thị lỗi này cho người dùng vì sản phẩm đã được tạo thành công
        }
        
        toast.success(response.mes);
        reset();
        setPayload({ description: "", infomations: "" });
        setPreview({ thumb: null, images: [] });
      } else {
        toast.error(response.mes);
      }
    } catch (err) {
      toast.error("Lỗi khi tạo sản phẩm: " + err.message);
    } finally {
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
    }
  };

  const handleRemoveImages = (name) => {
    const list = watch("images") || [];
    reset({ images: list.filter((f) => f.name !== name) });
    setPreview((prev) => ({ ...prev, images: prev.images.filter((e) => e.name !== name) }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
            <FaPlusCircle className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Thêm sản phẩm</h1>
            <p className="text-gray-500">Thêm một sản phẩm mới vào danh sách sản phẩm của cửa hàng</p>
          </div>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg px-4 py-6">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm label="Tên sản phẩm" register={register} errors={errors} id="title" validate={{ required: true }} fullWidth placeholder="Tên sản phẩm mới" />
          <div className="w-full flex gap-4 my-6">
            <div className="w-1/3">
              <InputForm label="Giá" register={register} errors={errors} id="price" validate={{ required: true }} type="number" placeholder="Giá" fullWidth />
            </div>
            <div className="w-1/3">
              <InputForm label="Số lượng" register={register} errors={errors} id="quantity" validate={{ required: true }} type="number" placeholder="Số lượng" fullWidth />
            </div>
            <div className="w-1/3">
              <InputForm label="Màu sắc" register={register} errors={errors} id="color" validate={{ required: true }} placeholder="Màu sắc" fullWidth />
            </div>
          </div>
          <div className="w-full flex gap-4 my-6">
            <div className="w-1/2">
              <Select label="Danh mục" id="category" register={register} errors={errors} validate={{ required: true }} options={categories.map((c) => ({ code: c._id, value: c.title }))} />
            </div>
            <div className="w-1/2">
              <Select label="Thương hiệu" id="brand" register={register} errors={errors} validate={{ required: true }} options={categories.find((c) => c._id === watch("category"))?.brand.map((b) => ({ code: b, value: b })) || []} />
            </div>
          </div>

          <MarkdownEditor 
            name="description" 
            changValue={changeDescription} 
            label="Thông số sản phẩm" 
            setIsFocusDescription={setIsFocusDescription} />
          <div className="mt-6">
            <MarkdownEditor 
              name="infomations" 
              changValue={changeInfomations} 
              label="Thông tin chi tiết sản phẩm" 
              setIsFocusDescription={setIsFocusInfomations} />
          </div>

          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">Tải lên ảnh chính</label>
            <input type="file" id="thumb" {...register("thumb", { required: true })} />
            {errors.thumb && <small className="text-xs text-red-500">{errors.thumb.message}</small>}
          </div>
          {preview.thumb && <img src={preview.thumb} alt="thumb" className="w-[200px] object-contain mt-4" />}

          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="images">Tải lên ảnh phụ</label>
            <input multiple type="file" id="images" {...register("images", { required: true })} />
            {errors.images && <small className="text-xs text-red-500">{errors.images.message}</small>}
          </div>
          {preview.images.length > 0 && (
            <div className="my-4 flex gap-3 flex-wrap">
              {preview.images.map((el, idx) => (
                <div key={idx} className="w-fit relative" onMouseEnter={() => setHoverEl(el.name)} onMouseLeave={() => setHoverEl(null)}>
                  <img src={el.path} alt={el.name} className="w-[200px] object-contain" />
                  {hoverEl === el.name && (
                    <div className="absolute inset-0 bg-overlay flex items-center justify-center cursor-pointer" onClick={() => handleRemoveImages(el.name)}>
                      <FaTrash size={25} color="red" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;