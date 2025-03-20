import React, { useState, useEffect, memo } from "react";
import ProductCard from "./ProductCard";
import { apiGetProducts } from "api/product";

const FeatureProducts = () => {
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await apiGetProducts({
        limit: 9,
        sort: '-totalRatings'
      });

      if (response && response.success) {
        setProducts(response.dataProducts || []);
      } else {
        console.error("Failed to fetch featured products:", response?.message);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
        FEATURED PRODUCTS
      </h3>
      {isLoading ? (
        <div className="min-h-[200px] flex items-center justify-center mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
        </div>
      ) : (
        <div className="flex flex-wrap mt-[15px]">
          {products && products.length > 0 ? (
            products.map((el) => (
              <ProductCard
                key={el._id}
                image={el.thumb}
                title={el.title}
                totalRatings={el.totalRatings}
                price={el.price}
              />
            ))
          ) : (
            <div className="w-full min-h-[200px] flex items-center justify-center text-gray-500">
              No featured products found
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 grid-rows-2 gap-4 mt-5">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-2 row-span-2"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-2"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        />
      </div>
    </div>
  );
};

export default memo(FeatureProducts);
