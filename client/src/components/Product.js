import React, { useState } from "react";
import { formatPrice, renderStarFromNumber } from "../utils/helpers";
import tagnew from "../assets/tagnew.png";
import trending from "../assets/trending.png";
import icons from '../utils/icons';
import {SelectOption} from './'

const {FaEye, TiThMenuOutline, FaHeart} = icons

const Product = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false)
  return (
    <div className="w-full text-base px-[10px]">
      <div 
        className="w-full border p-[15px] flex flex-col items-center" 
        onMouseEnter={e => {e.stopPropagation() 
          setIsShowOption(true)}} 
        onMouseLeave={e => {e.stopPropagation() 
          setIsShowOption(false)}}>
        <div className="w-full relative">
          {isShowOption && <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
            <SelectOption icon={<FaEye/>}/>
            <SelectOption icon={<TiThMenuOutline/>}/>
            <SelectOption icon={<FaHeart/>}/>
          </div>}
          <img
            src={
              productData?.thumb ||  "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
            }
            alt=""
            className="w-[270px] h-[250px] object-contain mx-auto"
          />
          <img
            src={isNew ? tagnew : trending}
            alt=""
            className="absolute top-[-15px] right-[-15px] w-[70px] h-[25px] object-cover"
          ></img> 
        </div>
        <div className="flex flex-col gap-2 mt-[15px] items-center gap-1 w-full">
          <span className="flex h-4">{renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
                      <span key={index}>{el}</span>
                    ))}</span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatPrice(productData?.price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
