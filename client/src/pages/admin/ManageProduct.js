import React, { useCallback, useEffect, useState, useRef } from "react";
import { CustomVarriant, InputForm, Pagination, Loading } from "components";
import { useForm } from "react-hook-form";
import { apiDeleteProduct, apiGetProducts } from "api";
import moment from "moment";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import { FaTrash, FaEdit} from "react-icons/fa";
import { BiSolidCustomize } from "react-icons/bi";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import { useDispatch } from "react-redux";
import { RiProductHuntLine } from "react-icons/ri";

const ManageProduct = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [products, setProducts] = useState(null);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [editProduct, setEditProduct] = useState(null)
  const [update, setUpdate] = useState(false)
  const [customVarriant, setCustomVarriant] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef({});

  const render = useCallback(() => {
    setUpdate(prev => !prev);
  }, []);  
 
  const fetchProducts = async (searchParams = {}) => {
    const cacheKey = JSON.stringify(searchParams);
    
    // Kiểm tra trong cache
    if (cacheRef.current[cacheKey]) {
      setProducts(cacheRef.current[cacheKey].products);
      setCounts(cacheRef.current[cacheKey].counts);
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
    }
  };

  const queryDebounce = useDebounce(watch("q"), 1000);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queryDebounce) {
      queries.q = queryDebounce;
    } else {
      delete queries.q;
    }
    navigate({
      pathname: location.pathname,
      search: new URLSearchParams(queries).toString(),
    });
  }, [queryDebounce, navigate, location]);
  

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProducts(searchParams);
  }, [params, update]);

  const handleDeleteProduct = (pid) => { 
    Swal.fire({
      title: "Delete Product",
      text: "Are you sure you want to delete this line?",
      icon: 'warning',
      showCancelButton: true
    }).then(async (result) => { 
      if (result.isConfirmed){
        const response = await apiDeleteProduct(pid)
        if (response.success) {
          toast.success(response.mes);
          // Xóa cache khi xóa sản phẩm
          cacheRef.current = {};
          // Tải lại dữ liệu
          const searchParams = Object.fromEntries([...params]);
          fetchProducts(searchParams);
        } else {
          toast.error(response.mes)
        }
      }
     })
   }

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {editProduct && <div className="absolute inset-0 bg-gray-100 z-50">
        <UpdateProduct 
          editProduct={editProduct} 
          render={render} 
          setEditProduct={setEditProduct}
          onSuccess={() => {
            // Xóa cache khi cập nhật sản phẩm
            cacheRef.current = {};
          }}
        />
      </div>}
      {customVarriant && <div className="absolute inset-0 bg-gray-100 z-50">
        <CustomVarriant 
          customVarriant={customVarriant} 
          render={render} 
          setCustomVarriant={setCustomVarriant}
          onSuccess={() => {
            // Xóa cache khi cập nhật variant
            cacheRef.current = {};
          }}
        />
      </div>}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
            <RiProductHuntLine className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
            <p className="text-gray-500">Manage and maintain your product catalog</p>
          </div>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>
      
      <div className="flex w-full justify-end items-center px-4 mb-6">
        <form className="w-[45%]">
          <InputForm
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Search product..."
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
              <th className="p-3 border">Thumb</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Brand</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Sold</th>
              <th className="p-3 border">Color</th>
              <th className="p-3 border">Ratings</th>
              <th className="p-3 border">Variants</th>
              <th className="p-3 border">UpdateAt</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-50" : ""}>
            {products?.map((el, index) => (
              <tr
                key={el._id}
                className="hover:bg-gray-100 transition-all border-b text-sm"
              >
                <td className="p-3 text-center border">
                  {(+params?.get("page") > 1 ? +params?.get("page") - 1 : 0) *
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
                <td className="p-3 text-center border">{el.varriants?.length || 0}</td>
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
                    className="text-gray-600 hover:text-gray-800 transition"
                    type="button" 
                    onClick={() => setCustomVarriant(el)}
                  >
                    <BiSolidCustomize size={20} />
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

export default ManageProduct;
