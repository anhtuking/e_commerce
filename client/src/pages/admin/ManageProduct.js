import React, { useEffect, useState } from "react";
import { InputForm, Pagination } from "components";
import { useForm } from "react-hook-form";
import { apiGetProducts } from "api";
import moment from "moment";
import { useSearchParams, createSearchParams, useNavigate, useLocation } from "react-router-dom";
import useDebounce from "hooks/useDebounce";

const ManageProduct = () => {
  const {
    register,
    formState: { errors },
    watch
  } = useForm();
  const [products, setProducts] = useState(null);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchProducts = async (searchParams = {}) => {
    const response = await apiGetProducts({
      ...searchParams,
      limit: process.env.REACT_APP_LIMIT || 10,
    });

    if (response.success) {
      setProducts(response.dataProducts);
      setCounts(response.counts);
    }
  };

  const queryDebounce = useDebounce(watch("q"), 1000)
  useEffect(() => { 
    if(queryDebounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({q:queryDebounce}).toString()
      })
    }else navigate({
      pathname: location.pathname
    })
  }, [queryDebounce, navigate, location])

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchProducts(searchParams);
  }, [params, queryDebounce]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
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
              <th className="p-3 border">UpdateAt</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((el, index) => (
              <tr
                key={el.id}
                className="hover:bg-gray-100 transition-all border-b text-sm"
              >
                <td className="p-3 text-center border">{((+params?.get('page') > 1 ? +params?.get('page') - 1 : 0 ) * process.env.REACT_APP_LIMIT) + index + 1}</td>
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
                <td className="p-3 text-center border">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
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
