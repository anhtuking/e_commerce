import React, { memo, useEffect, useState } from "react";
import { apiGetProducts } from "api/product";
import Product from "./Product";
import Slider from "react-slick";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
];

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await Promise.all([
        apiGetProducts({ sort: "-sold" }),
        apiGetProducts({ sort: "-createdAt" }),
      ]);
      
      if (response[0]?.success) {
        setBestSellers(response[0].dataProducts || []);
        setProducts(response[0].dataProducts || []);
      } else {
        setBestSellers([]);
        console.error("Failed to fetch best sellers:", response[0]?.message);
      }
      
      if (response[1]?.success) {
        setNewProducts(response[1].dataProducts || []);
      } else {
        setNewProducts([]);
        console.error("Failed to fetch new products:", response[1]?.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setBestSellers([]);
      setNewProducts([]);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  useEffect(() => {
    if (activeTab === 1) setProducts(bestSellers || []);
    if (activeTab === 2) setProducts(newProducts || []);
  }, [activeTab, bestSellers, newProducts]);

  return (
    <div className="w-full">
      <div className="flex text-[20px] border-b-2 border-main pb-4 ml-[-32px]">
        {tabs.map((tab) => (
          <span
            key={tab.id}
            className={`capitalize font-semibold px-8 border-r cursor-pointer ${
              activeTab === tab.id ? "text-main" : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </span>
        ))}
      </div>
      <div className="mt-4">
        {isLoading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
          </div>
        ) : (
          products && products.length > 0 ? (
            <Slider {...settings}>
              {products.map((el) => (
                <Product
                  key={el._id}
                  pid={el._id}
                  productData={el}
                  isNew={activeTab === 2}
                />
              ))}
            </Slider>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center text-gray-500">
              No products found
            </div>
          )
        )}
      </div>
      <div className="w-full flex gap-4 mt-8 ">
        <img 
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          alt="banner"
          className="flex-1 object-cover transition-transform duration-300 hover:scale-110"
        />
        <img 
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          alt="banner"
          className="flex-1 object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  );
};

export default memo(BestSellers);