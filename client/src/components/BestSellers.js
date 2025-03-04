import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../api/product";
import Product from "./Product";
import Slider from "react-slick";

const tabs = [
  { id: 1, name: "BEST SELLERS" },
  { id: 2, name: "NEW ARRIVALS" },
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
  const fetchProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "-createdAt" }),
    ]);
    // console.log("Fetched Products:", response);
    if (response[0]?.success) {
      setBestSellers(response[0].dataProducts);
      setProducts(response[0].dataProducts);
    }
    if (response[1]?.success) setNewProducts(response[1].dataProducts);
    setProducts(response[0].dataProducts);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (activeTab === 1) setProducts(bestSellers);
    if (activeTab === 2) setProducts(newProducts);
  }, [activeTab, bestSellers, newProducts]);
  return (
    <div>
      <div className="flex text-[20px] gap-8 pb-4 border-b-2 relative">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`font-semibold capitalize cursor-pointer text-gray-400 ${
              activeTab === el.id ? "text-gray-900" : ""
            }`}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
            {activeTab === el.id && (
              <div
                className={`absolute bottom-[-8px] left-0 w-full h-[3px] ${
                  activeTab === 1 ? "bg-blue-500" : "bg-yellow-400"
                }`}
              ></div>
            )}
          </span>
        ))}
      </div>
      <div className="mt-4 mx-[-10px] pt-2">
        <Slider {...settings}>
          {products?.map((el) => (
            <Product
              key={el.id}
              pid={el.id}
              productData={el}
              isNew={activeTab === 1 ? false : true}
            />
          ))}
        </Slider>
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

export default BestSellers;
