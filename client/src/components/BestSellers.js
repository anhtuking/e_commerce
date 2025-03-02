import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../api/product";
import Product from "./Product";
import Slider from "react-slick";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
  { id: 3, name: "tablet" },
];

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const fetchProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "-createdAt" }),
    ]);
    console.log("Fetched Products:", response);
    if (response[0]?.success) setBestSellers(response[0].dataProducts);
    if (response[1]?.success) setNewProducts(response[1].dataProducts);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div>
      <div className="flex text-[20px] gap-8 pb-4 border-b-2 border-main">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`font-semibold capitalize border-r cursor-pointer text-gray-400 ${
              activeTab === el.id ? "text-gray-900" : ""
            }`}
            onClick={() => setActiveTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <Slider {...settings}>
          {bestSellers?.map((el) => (
            <Product key={el.id} productData={el} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BestSellers;
