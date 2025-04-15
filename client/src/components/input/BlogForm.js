import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputForm } from "components";
import { toast } from "react-toastify";
import { apiCreateBlog, apiUpdateBlog, apiUploadImageBlog } from "api/blog";
import withBase from "hocs/withBase";
import Swal from "sweetalert2";

const BlogForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      author: initialData?.author || "Admin"
    }
  });
  const [previewImage, setPreviewImage] = useState(initialData?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        author: initialData.author
      });
      setPreviewImage(initialData.image);
    }
  }, [initialData, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      let blogId = initialData?._id;
      let response;
      
      if (blogId) {
        // Cập nhật blog
        response = await apiUpdateBlog(blogId, data);
        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Không thể cập nhật bài viết");
        }
      } else {
        // Tạo blog mới
        response = await apiCreateBlog(data);
        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Không thể tạo bài viết mới");
        }
        blogId = response.data.createdBlog._id;
      }
      
      // Upload ảnh nếu có
      if (imageFile && blogId) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);
        const imageResponse = await apiUploadImageBlog(blogId, imageFormData);
        if (!imageResponse?.data?.status) {
          console.warn("Không thể upload ảnh");
        }
      }
      
      setIsSubmitting(false);
      
      // Sử dụng Swal thay vì toast
      Swal.fire({
        icon: 'success',
        title: initialData ? "Cập nhật thành công!" : "Tạo mới thành công!",
        text: initialData 
          ? "Bài viết đã được cập nhật thành công."
          : "Bài viết mới đã được tạo thành công.",
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          reset();
          setPreviewImage("");
          setImageFile(null);
          onSubmit(); // Đóng form và refresh danh sách
        }
      });
      
    } catch (error) {
      console.error("Error submitting blog:", error);
      setIsSubmitting(false);
      
      // Hiển thị thông báo lỗi bằng Swal
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || "Có lỗi xảy ra khi lưu bài viết",
        confirmButtonColor: '#d33',
        confirmButtonText: 'Thử lại'
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {initialData ? "Cập nhật bài viết" : "Tạo bài viết mới"}
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Tiêu đề</label>
          <InputForm
            id="title"
            register={register}
            errors={errors}
            validate={{ required: "Tiêu đề không được để trống" }}
            placeholder="Nhập tiêu đề bài viết"
            fullWidth
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Danh mục</label>
          <InputForm
            id="category"
            register={register}
            errors={errors}
            validate={{ required: "Danh mục không được để trống" }}
            placeholder="Nhập danh mục"
            fullWidth
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Tác giả</label>
          <InputForm
            id="author"
            register={register}
            errors={errors}
            defaultValue="Admin"
            placeholder="Nhập tên tác giả"
            fullWidth
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Nội dung</label>
          <textarea
            {...register("description", { required: "Nội dung không được để trống" })}
            className="w-full border border-gray-300 rounded-md p-2 min-h-[200px]"
            placeholder="Nhập nội dung bài viết"
          ></textarea>
          {errors?.description && (
            <span className="text-red-500 text-xs">{errors.description.message}</span>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Hình ảnh</label>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <input
                type="file"
                onChange={handleImageChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                accept="image/*"
              />
            </div>
            {previewImage && (
              <div className="w-32 h-32 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitting 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </div>
            ) : initialData ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withBase(memo(BlogForm)); 