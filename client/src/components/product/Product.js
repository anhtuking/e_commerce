import React, { memo, useState } from "react";
import { formatPrice, renderStarFromNumber } from "utils/helpers";
import tagnew from "assets/tagnew.png";
import trending from "assets/trending.png";
import icons from 'utils/icons';
import SelectOption from '../search/SelectOption'
import withBase from "hocs/withBase";
import { showModal } from "store/app/appSlice";
import QuickView from "./QuickView";
const {FaEye, TiThMenuOutline, FaHeart} = icons

const Product = ({ productData, isNew, normal, navigate, dispatch }) => {
  const [isShowOption, setIsShowOption] = useState(false)
  const handleClickOption = (e, flag) => {
    e.stopPropagation()
    if (flag === 'MENU') navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)
    if (flag === 'WISHLIST') {
      console.log('WISHLIST')
    }
    if (flag === 'VIEW') {
      dispatch(showModal({
        isShowModal: true, 
        modalChildren: <QuickView data={productData} />
      }))
    }
  }
  return (
    <div className="w-full text-base px-[10px] font-main2">
      <div 
        className="w-full border p-[15px] flex flex-col items-center" 
        onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
        onMouseEnter={e => {e.stopPropagation() 
          setIsShowOption(true)}} 
        onMouseLeave={e => {e.stopPropagation() 
          setIsShowOption(false)}}>
        <div className="w-full relative">
          {isShowOption && <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
            <span title="Quick View" onClick={(e) => handleClickOption(e, 'VIEW')}><SelectOption icon={<FaEye/>}/></span>
            <span title="More options" onClick={(e) => handleClickOption(e, 'MENU')}><SelectOption icon={<TiThMenuOutline/>}/></span>
            <span title="Wishlist" onClick={(e) => handleClickOption(e, 'WISHLIST')}><SelectOption icon={<FaHeart/>}/></span>
          </div>}
          <img
            src={
              productData?.thumb ||  "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
            }
            alt=""
            className="w-[270px] h-[250px] object-contain mx-auto"
          />
          {!normal && <img
            src={isNew ? tagnew : trending}
            alt=""
            className="absolute top-[-15px] right-[-15px] w-[70px] h-[25px] object-cover"
          ></img>} 
        </div>
        <div className="flex flex-col gap-2 mt-[15px] items-center w-full">
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

export default withBase(memo(Product));
