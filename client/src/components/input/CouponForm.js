import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputForm } from "components";
import { toast } from "react-toastify";
import { apiCreateCoupon, apiUpdateCoupon } from "api/coupon";

const CouponForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      discount: initialData?.discount || ""
    }
  });
  const [expiryDays, setExpiryDays] = useState(initialData?.expiryDays || 7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Tính số ngày từ ngày hiện tại đến ngày hết hạn
      if (initialData.expiry) {
        const expiryDate = new Date(initialData.expiry);
        const currentDate = new Date();
        const diffTime = expiryDate - currentDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setExpiryDays(diffDays > 0 ? diffDays : 7);
      }

      reset({
        name: initialData.name,
        discount: initialData.discount,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const couponData = {
        ...data,
        expiry: expiryDays
      };
      
      let response;
      if (initialData?._id) {
        response = await apiUpdateCoupon(initialData._id, couponData);
      } else {
        response = await apiCreateCoupon(couponData);
      }
      
      if (response?.success) {
        toast.success(initialData ? 'Cập nhật mã giảm giá thành công!' : 'Tạo mã giảm giá thành công!');
        reset();
        onSubmit(); // Gọi callback để đóng form và cập nhật danh sách
      } else {
        toast.error(response?.mes || 'Đã xảy ra lỗi!');
      }
    } catch (error) {
      console.error('Error creating/updating coupon:', error);
      toast.error(error?.mes || 'Đã xảy ra lỗi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {initialData ? 'Cập nhật mã giảm giá' : 'Tạo mã giảm giá mới'}
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Tên mã giảm giá</label>
          <InputForm
            id="name"
            register={register}
            errors={errors}
            validate={{ 
              required: "Tên mã giảm giá không được để trống",
              minLength: {
                value: 3,
                message: "Tên mã giảm giá phải có ít nhất 3 ký tự"
              },
              maxLength: {
                value: 15,
                message: "Tên mã giảm giá không được vượt quá 15 ký tự"
              },
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "Tên mã giảm giá chỉ được chứa chữ cái và số"
              }
            }}
            placeholder="Nhập tên mã giảm giá (ví dụ: SUMMER2023)"
            fullWidth
          />
          <p className="text-gray-500 text-xs mt-1 italic">
            Tên mã giảm giá sẽ được tự động chuyển thành chữ hoa
          </p>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Giá trị giảm giá (%)</label>
          <InputForm
            id="discount"
            register={register}
            errors={errors}
            validate={{ 
              required: "Giá trị giảm giá không được để trống",
              min: {
                value: 1,
                message: "Giá trị giảm giá tối thiểu là 1%"
              },
              max: {
                value: 99,
                message: "Giá trị giảm giá tối đa là 99%"
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "Giá trị giảm giá phải là số"
              }
            }}
            placeholder="Nhập % giảm giá (ví dụ: 10)"
            fullWidth
            type="number"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Thời hạn (ngày)</label>
          <div className="flex items-center">
            <input
              type="range"
              min="1"
              max="90"
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-4 text-gray-700 font-medium w-12">{expiryDays}</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Mã giảm giá có hiệu lực trong {expiryDays} ngày kể từ hôm nay
          </p>
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {initialData ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default memo(CouponForm); 