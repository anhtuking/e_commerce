import React from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import {
  Breadcrumb,
  SearchItems,
  InputSelect,
  Pagination
} from "components";
import Product from "components/product/Product";
import { apiGetProducts } from "api/product";
import { useEffect, useState, useCallback, useRef } from "react";
import Masonry from "react-masonry-css";
import { sorts } from "../../utils/contants";

const breakpointColumnsObj = {
  default: 5,
  1100: 4,
  700: 3,
  500: 2,
};

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null);
  const [params] = useSearchParams();
  const [sort, setSorts] = useState("");
  const { category } = useParams();
  const categoryRef = useRef(null);

  const fetchProductsByCategory = async (queries) => {
    if (category && category !== 'products') queries.category = category
    const response = await apiGetProducts(queries);
    if (response.success) setProducts(response);
  };
  useEffect(() => {
    const queries = Object.fromEntries([...params])
    let priceQuery = {};
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    } else {
      if (queries.from) queries.price = { gte: queries.from };
      if (queries.to) queries.price = { gte: queries.to };
    }

    delete queries.to;
    delete queries.from;
    const q = { ...priceQuery, ...queries };

    fetchProductsByCategory(q);
    if (categoryRef.current) {
      categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo(0,0);
    }
  }, [params]);
  const changeActiveFilter = useCallback(
    (name) => {
      if (activeClick === name) setActiveClick(null);
      else setActiveClick(name);
    },
    [activeClick]
  );

  const changeValue = useCallback(
    (value) => {
      setSorts(value);
    },
    [sort]
  );
  useEffect(() => {
    if(sort) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({ sort }).toString(),
      });
    }
  }, [sort, category, navigate]);
  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3 ref={categoryRef} className="font-semibold uppercase">{category}</h3>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className="w-main border-item p-4 flex justify-between mt-8 m-auto">
        <div className="w-4/5 flex-auto flex flex-col gap-3">
          <span className="font-main2 font-bold text-sm uppercase">
            Filter by:
          </span>
          <div className="flex items-center gap-4">
            <SearchItems
              name="Price"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
              type="input"
            />
            <SearchItems
              name="Color"
              activeClick={activeClick}
              changeActiveFilter={changeActiveFilter}
            />
          </div>
        </div>
        <div className="w-1/5 flex-col flex">
          <span className="font-main2 font-bold text-sm uppercase">
            Sort by:
          </span>
          <div className="w-full">
            <InputSelect
              value={sort}
              options={sorts}
              changeValue={changeValue}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 w-main m-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex"
          columnClassName="my-masonry-grid_column"
        >
          {products?.dataProducts?.map((el) => (
            <Product key={el._id} pid={el._id} productData={el} normal={true} />
          ))}
        </Masonry>
      </div>
      <div className="w-full flex justify-center items-center my-8">
        <div className="flex flex-col items-center">
          <Pagination 
            totalCount={products?.counts}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;