import React, { useCallback, useEffect, useState, useRef } from "react";
import { CustomVariant, InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import { apiDeleteProduct, apiGetProducts } from "api";
import moment from "moment";
import { useSearchParams, createSearchParams, useLocation} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import { FaTrash, FaEdit} from "react-icons/fa";
import { BiSolidCustomize } from "react-icons/bi";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { RiProductHuntLine } from "react-icons/ri";
import withBase from "hocs/withBase";

const ManageProduct = ({dispatch, navigate}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [products, setProducts] = useState(null);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const location = useLocation();
  const [editProduct, setEditProduct] = useState(null)
  const [update, setUpdate] = useState(false)
  const [customVariant, setCustomVariant] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef({});
  const fetchInProgressRef = useRef(false);

  const render = useCallback(() => {
    setUpdate(prev => !prev);
  }, []);  
 
  const fetchProducts = useCallback(async (searchParams = {}) => {
    // Ngăn việc gọi nhiều lần trong cùng một render cycle
    if (fetchInProgressRef.current) return;
    fetchInProgressRef.current = true;
    
    const cacheKey = JSON.stringify(searchParams);
    
    // Kiểm tra trong cache
    if (cacheRef.current[cacheKey]) {
      setProducts(cacheRef.current[cacheKey].products);
      setCounts(cacheRef.current[cacheKey].counts);
      fetchInProgressRef.current = false;
      return;
    }
    
    // Hiển thị loading nhưng không dùng modal
    setIsLoading(true);
    
    try {
      const response = await apiGetProducts({
        ...searchParams,
        limit: process.env.REACT_APP_LIMIT || 10,
      });
      if (response.success) {
        setProducts(response.dataProducts);
        setCounts(response.counts);
        
        // Lưu vào cache
        cacheRef.current[cacheKey] = {
          products: response.dataProducts,
          counts: response.counts
        };
      }
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
      fetchInProgressRef.current = false;
    }
  }, []);

  const queryDebounce = useDebounce(watch("q"), 1000);
  
  // UseEffect để xử lý queries từ thanh tìm kiếm
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
  
  // UseEffect riêng để fetch data khi params hoặc update thay đổi
  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProducts(searchParams);
  }, [params, update, fetchProducts]);

  const handleDeleteProduct = async (pid) => {
    const result = await Swal.fire({
      title: "Xóa sản phẩm",
      text: "Bạn có chắc muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });
    if (!result.isConfirmed) return;
  
    try {
      const response = await apiDeleteProduct(pid);
      const { data } = response;
      if (data.success) {
        toast.success(data.mes);
        cacheRef.current = {};
        render();
      } else {
        toast.error(data.mes);
      }
    } catch (error) {
      const msg = error.response?.data?.mes || error.response?.data?.message || error.message || "Đã có lỗi xảy ra";
      toast.error(msg);
    }
  };

   return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Edit Product Overlay */}
      {editProduct && (
        <div className="absolute inset-0 bg-gray-100 z-50">
          <UpdateProduct
            editProduct={editProduct}
            render={render}
            setEditProduct={setEditProduct}
            onSuccess={() => {
              cacheRef.current = {};
            }}
          />
        </div>
      )}

      {/* Custom Variant Overlay */}
      {customVariant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <CustomVariant
            customVariant={customVariant}
            render={render}
            setCustomVariant={setCustomVariant}
            onSuccess={() => {
              cacheRef.current = {};
            }}
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
            <RiProductHuntLine className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
            <p className="text-gray-500">Quản lý và bảo trì danh sách sản phẩm của cửa hàng</p>
          </div>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>

      {/* Search */}
      <div className="flex w-full justify-end items-center px-4 mb-6">
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
          />
        </form>
      </div>

      {/* Product Table */}
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
              <th className="p-3 border">Ảnh</th>
              <th className="p-3 border">Tên sản phẩm</th>
              <th className="p-3 border">Thương hiệu</th>
              <th className="p-3 border">Danh mục</th>
              <th className="p-3 border">Giá</th>
              <th className="p-3 border">Số lượng</th>
              <th className="p-3 border">Đã bán</th>
              <th className="p-3 border">Màu sắc</th>
              <th className="p-3 border">Đánh giá</th>
              <th className="p-3 border">Biến thể</th>
              <th className="p-3 border">Cập nhật</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-50" : ""}>
            {products?.map((el, index) => (
              <tr
                key={el._id}
                className="hover:bg-gray-100 transition-all border-b text-sm"
              >
                <td className="p-3 text-center border">
                  {(+params?.get("page") > 1
                    ? +params?.get("page") - 1
                    : 0) *
                    process.env.REACT_APP_LIMIT +
                    index +
                    1}
                </td>
                <td className="p-3 text-center border">
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className="w-12 h-12 object-cover rounded-md shadow-sm"
                  />
                </td>
                <td className="p-3 border">{el.title}</td>
                <td className="p-3 text-center border">{el.brand}</td>
                <td className="p-3 text-center border">{el.category}</td>
                <td className="p-3 text-center border">{el.price} VND</td>
                <td className="p-3 text-center border">{el.quantity}</td>
                <td className="p-3 text-center border">{el.sold}</td>
                <td className="p-3 text-center border">{el.color}</td>
                <td className="p-3 text-center border">{el.totalRatings}</td>
                <td className="p-3 text-center border">{el.variants?.length || 0}</td>
                <td className="p-3 text-center border">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="mt-6 flex items-center justify-center gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    type="button"
                    onClick={() => setEditProduct(el)}
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition"
                    type="button"
                    onClick={() => handleDeleteProduct(el._id)}
                  >
                    <FaTrash size={18} />
                  </button>
                  <button
                    className="text-indigo-600 hover:text-indigo-800 transition p-1"
                    type="button"
                    onClick={() => setCustomVariant(el)}
                  >
                    <BiSolidCustomize size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full text-right justify-end my-4">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default withBase(ManageProduct);