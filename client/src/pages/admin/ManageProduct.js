import React, { useCallback, useEffect, useState } from "react";
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

  const render = useCallback(() => {
    setUpdate(prev => !prev);
  }, []);  
 
  const fetchProducts = async (searchParams = {}) => {
    
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiGetProducts({
      ...searchParams,
      limit: process.env.REACT_APP_LIMIT || 10,
    });
    dispatch(showModal({ isShowModal: false, modalChildren: null }));

    if (response.success) {
      setProducts(response.dataProducts);
      setCounts(response.counts);
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
  }, [params, queryDebounce]);

  const handleDeleteProduct = (pid) => { 
    Swal.fire({
      title: "Delete Product",
      text: "Are you sure you want to delete this line?",
      icon: 'warning',
      showCancelButton: true
    }).then(async (result) => { 
      if (result.isConfirmed){
        const response = await apiDeleteProduct(pid)
        if (response.success) toast.success(response.mes)
          else toast.error(response.mes)
      }
     })
   }

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {editProduct && <div className="absolute inset-0 bg-gray-100 z-50">
        <UpdateProduct editProduct={editProduct} render={render} setEditProduct={setEditProduct}/>
      </div>}
      {customVarriant && <div className="absolute inset-0 bg-gray-100 z-50">
        <CustomVarriant customVarriant={customVarriant} render={render} setCustomVarriant={setCustomVarriant}/>
      </div>}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Product</h1>
      <div className="flex w-full justify-end items-center px-4">
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
      <div className="h-[20px] w-full"></div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-sky-900 text-white text-sm">
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
          <tbody>
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
