import React, { useCallback, useEffect, useState, useRef } from "react";
import { InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import moment from "moment";
import {
  useSearchParams,
  createSearchParams,
  useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import { FaTrash, FaEdit, FaTag, FaCalendarAlt, FaPercentage } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import withBase from "hocs/withBase";
import { apiGetAllCoupons, apiCreateCoupon, apiUpdateCoupon, apiDeleteCoupon } from "api/coupon";

const CouponForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [expiryDays, setExpiryDays] = useState(initialData?.expiryDays || 7);

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
      
      if (response.data.success) {
        toast.success(initialData ? 'Cập nhật mã giảm giá thành công!' : 'Tạo mã giảm giá thành công!');
        reset();
        onSubmit();
      } else {
        toast.error(response.data.mes || 'Đã xảy ra lỗi!');
      }
    } catch (error) {
      console.error('Error creating/updating coupon:', error);
      toast.error(error.response?.data?.mes || 'Đã xảy ra lỗi!');
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
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            {initialData ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ManageCoupon = ({ dispatch, navigate }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [coupons, setCoupons] = useState([]);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const location = useLocation();
  const [editCoupon, setEditCoupon] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef({});
  const fetchInProgressRef = useRef(false);

  const render = useCallback(() => {
    setUpdate((prev) => !prev);
  }, []);

  const fetchCoupons = useCallback(async () => {
    if (fetchInProgressRef.current) return;
    fetchInProgressRef.current = true;

    setIsLoading(true);
    try {
      const response = await apiGetAllCoupons();
      if (response.data.success) {
        setCoupons(response.data.coupons);
        setCounts(response.data.coupons.length);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách mã giảm giá");
    } finally {
      setIsLoading(false);
      fetchInProgressRef.current = false;
    }
  }, []);

  const queryDebounce = useDebounce(watch("q"), 1000);

  useEffect(() => {
    if (queryDebounce !== undefined) {
      const queries = Object.fromEntries([...params]);
      if (queryDebounce) {
        queries.q = queryDebounce;
      } else {
        delete queries.q;
      }
      navigate({
        pathname: location.pathname,
        search: createSearchParams(queries).toString(),
      });
    }
  }, [queryDebounce, navigate, location.pathname, params]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons, update]);

  const handleDeleteCoupon = (cid) => {
    Swal.fire({
      title: "Xóa mã giảm giá",
      text: "Bạn có chắc chắn muốn xóa mã giảm giá này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await apiDeleteCoupon(cid);
          if (response.data.success) {
            toast.success("Xóa mã giảm giá thành công");
            render();
          } else {
            toast.error(response.data.mes || "Xóa mã giảm giá thất bại");
          }
        } catch (error) {
          toast.error("Xóa mã giảm giá thất bại");
        }
      }
    });
  };

  const handleSubmitForm = () => {
    setEditCoupon(null);
    setIsCreating(false);
    render();
  };

  const handleCancel = () => {
    setEditCoupon(null);
    setIsCreating(false);
  };

  // Lọc và tìm kiếm coupons
  const filteredCoupons = coupons.filter(coupon => {
    if (!queryDebounce) return true;
    return coupon.name.toLowerCase().includes(queryDebounce.toLowerCase());
  });

  // Kiểm tra trạng thái mã giảm giá (còn hạn hay hết hạn)
  const getCouponStatus = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry > now;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Form chỉnh sửa hoặc tạo mới */}
      {(editCoupon || isCreating) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CouponForm
              onSubmit={handleSubmitForm}
              initialData={editCoupon}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
            <FaTag className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý mã giảm giá</h1>
            <p className="text-gray-500">Quản lý và cài đặt các mã giảm giá và khuyến mãi</p>
          </div>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>

      <div className="flex justify-between items-center px-4 mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-sm flex items-center"
          onClick={() => setIsCreating(true)}
        >
          <span className="mr-2">+</span> Tạo mã giảm giá mới
        </button>
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Tìm kiếm mã giảm giá..."
          />
        </form>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        )}
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Mã giảm giá</th>
              <th className="p-3 border">Giảm giá (%)</th>
              <th className="p-3 border">Ngày tạo</th>
              <th className="p-3 border">Ngày hết hạn</th>
              <th className="p-3 border">Trạng thái</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-50" : ""}>
            {filteredCoupons.map((coupon, index) => (
              <tr
                key={coupon._id}
                className="hover:bg-gray-100 transition-all border-b text-sm"
              >
                <td className="p-3 text-center border">{index + 1}</td>
                <td className="p-3 text-center border font-medium">{coupon.name}</td>
                <td className="p-3 text-center border">
                  <span className="flex items-center justify-center">
                    <FaPercentage className="mr-1 text-blue-500" />
                    {coupon.discount}
                  </span>
                </td>
                <td className="p-3 text-center border">
                  {moment(coupon.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="p-3 text-center border">
                  {moment(coupon.expiry).format("DD/MM/YYYY")}
                </td>
                <td className="p-3 text-center border">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getCouponStatus(coupon.expiry)
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getCouponStatus(coupon.expiry) ? "Còn hạn" : "Hết hạn"}
                  </span>
                </td>
                <td className="p-3 flex items-center justify-center gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    type="button"
                    onClick={() => setEditCoupon(coupon)}
                    title="Chỉnh sửa"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition"
                    type="button"
                    onClick={() => handleDeleteCoupon(coupon._id)}
                    title="Xóa"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCoupons.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            {queryDebounce ? "Không tìm thấy mã giảm giá phù hợp" : "Chưa có mã giảm giá nào"}
          </div>
        )}
        <div className="w-full text-right justify-end my-4">
          <Pagination totalCount={filteredCoupons.length} />
        </div>
      </div>
      
      {/* Thống kê nhanh */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaTag className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Tổng số mã giảm giá</h3>
              <p className="text-2xl font-semibold">{coupons.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCalendarAlt className="text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Mã giảm giá còn hạn</h3>
              <p className="text-2xl font-semibold">
                {coupons.filter(coupon => getCouponStatus(coupon.expiry)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FaCalendarAlt className="text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Mã giảm giá hết hạn</h3>
              <p className="text-2xl font-semibold">
                {coupons.filter(coupon => !getCouponStatus(coupon.expiry)).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(ManageCoupon); 