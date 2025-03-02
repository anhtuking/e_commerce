import React from "react";
import { formatPrice } from "../utils/helpers";
import labelRed from "../assets/labelRed.png";
import labelBlue from "../assets/labelBlue.png";

const Product = ({ productData, isNew }) => {
  return (
    <div className="w-full text-base px-[10px]">
      <div className="w-full product-item p-[15px] flex flex-col items-center">
        <div className="w-full relative items-center">
          <img
            src={
              productData?.thumb ||  "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
            }
            alt=""
            className="w-[190px] h-[190px] object-contain mx-auto"
          />
          <img
            src={isNew ? labelBlue : labelRed}
            alt=""
            className="absolute top-[-14px] left-[-40px] w-[130px] h-[50px] object-cover"
          ></img> 
            {isNew 
            ? <span className="font-bold top-[-5px] left-[5px] text-white absolute">New</span>
            : <span className="font-bold top-[-5px] left-[-15px] text-white absolute">Trending</span>}
        </div>
        <div className="flex flex-col gap-2 mt-[15px] items-center gap-1 w-full">
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatPrice(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
