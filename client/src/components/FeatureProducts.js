import React, { useState, useEffect } from "react";
import { ProductCard } from "./";
import { apiGetProducts } from "../api/product";

const FeatureProducts = () => {
  const [products, setProducts] = useState(null);
  const fetchProducts = async () => {
    const response = await apiGetProducts({
      limit: 9,
      //  page: Math.round(Math.random() * 7),
      totalRatings: 5,
    });
    console.log(response);
    if (response.success) setProducts(response.dataProducts);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="w-full">
      <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
        FEATURED PRODUCTS
      </h3>
      <div className="flex flex-wrap mt-[15px]">
        {products?.map((el) => (
          <ProductCard
            key={el.id}
            image={el.thumb}
            title={el.title}
            totalRatings={el.totalRatings}
            price={el.price}
          />
        ))}
      </div>
      <div className="flex gap-4 mt-5">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
          alt=""
          className="w-[50%] h-auto object-cover transition-transform duration-300 transform hover:scale-100 hover:shadow-xl hover:brightness-110 hover:rotate-2 hover:blur-[1px]"
        />
        <div className="flex flex-col justify-between w-[25%] gap-4">
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
            alt=""
            className="w-full object-cover transition-transform duration-300 transform hover:scale-100 hover:shadow-xl hover:brightness-110 hover:rotate-2 hover:blur-[1px]"
          />
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
            alt=""
            className="w-full object-cover transition-transform duration-300 transform hover:scale-100 hover:shadow-xl hover:brightness-110 hover:rotate-2 hover:blur-[1px]"
          />
        </div>
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
          alt=""
          className="w-[25%] h-auto object-cover transition-transform duration-300 transform hover:scale-100 hover:shadow-xl hover:brightness-110 hover:rotate-2 hover:blur-[1px]"
        />
      </div>
    </div>
  );
};

export default FeatureProducts;
