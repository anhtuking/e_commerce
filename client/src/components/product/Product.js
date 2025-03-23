import React, { memo, useState, useEffect } from "react";
import { formatPrice, renderStarFromNumber } from "utils/helpers";
import tagnew from "assets/tagnew.png";
import trending from "assets/trending.png";
import icons from 'utils/icons';
import SelectOption from '../search/SelectOption'
import withBase from "hocs/withBase";
import { showModal } from "store/app/appSlice";
import QuickView from "./QuickView";
import { toast } from "react-toastify";
import { apiUpdateCart } from "api/user";
import { getCurrent } from "store/user/asyncAction";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BsCartCheckFill } from "react-icons/bs";

const { FaEye, FaCartPlus, FaHeart } = icons
const Product = ({ productData, isNew, normal, navigate, dispatch }) => {
  const [isShowOption, setIsShowOption] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { current } = useSelector(state => state.user)

  const handleClickOption = async (e, flag) => {
    e.stopPropagation()
    if (flag === 'CART') {
      if (!current)
        Swal.fire({
          title: 'Wait...',
          text: 'Please login to add to cart',
          icon: 'info',
          confirmButtonText: 'Login',
          denyButtonText: 'Cancel',
          showDenyButton: true,
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login')
          }
        })
      const response = await apiUpdateCart({
        pid: productData._id,
        color: productData.color || 'Default',
      })
      if (response.success) {
        toast.success(response.mes)
        dispatch(getCurrent())
      } else {
        toast.error(response.mes)
      }
    }
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
    <div className="w-full text-base px-[10px] font-main2 opacity-0 animate-fade-in">
      <div
        className={`w-full rounded-lg bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center overflow-hidden group transform ${isHovered ? 'scale-[1.02]' : 'scale-100'} transition-transform duration-300`}
        onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
        onMouseEnter={e => {
          e.stopPropagation()
          setIsShowOption(true)
          setIsHovered(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setIsShowOption(false)
          setIsHovered(false)
        }}
      >
        <div className="w-full relative p-4 overflow-hidden">
          {isShowOption &&
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10 animate-slide-up">
              <span title="Quick View" onClick={(e) => handleClickOption(e, 'VIEW')}>
                <SelectOption icon={<FaEye />} />
              </span>
              {current?.cart?.some(el => el.product === productData._id.toString())
                ? <span title="Added to cart"><SelectOption icon={<BsCartCheckFill color="red" />} /></span>
                : <span title="Add to cart" onClick={(e) => handleClickOption(e, 'CART')}><SelectOption icon={<FaCartPlus />} /></span>}
              <span title="Add to wishlist" onClick={(e) => handleClickOption(e, 'WISHLIST')}>
                <SelectOption icon={<FaHeart />} />
              </span>
            </div>
          }

          <div className={`relative overflow-hidden rounded-md bg-gray-50 flex items-center justify-center transform ${isHovered ? 'scale-[1.05]' : 'scale-100'} transition-transform duration-300`}>
            <img
              src={productData?.thumb || "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"}
              alt={productData?.title}
              className={`w-full h-[230px] object-contain p-4 transform ${isHovered ? 'scale-[1.1]' : 'scale-100'} transition-transform duration-400`}
            />

            {!normal && (
              <div className="absolute top-2 right-2 rotate-0 transition-transform duration-300">
                <img
                  src={isNew ? tagnew : trending}
                  alt={isNew ? "New" : "Trending"}
                  className="w-[70px] object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 items-center w-full border-t">
          <div className="flex h-4 text-yellow-400">
            {renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </div>

          <h3 className="text-gray-800 font-medium text-center line-clamp-1 mt-1 group-hover:text-red-600 transition-colors">
            {productData?.title}
          </h3>

          <div className="flex items-center gap-2">
            {productData?.price && (
              <span className="text-red-600 font-bold">
                {`${formatPrice(productData?.price)} VND`}
              </span>
            )}
            {productData?.priceOld && (
              <span className="text-gray-400 line-through text-sm">
                {`${formatPrice(productData?.priceOld)} VND`}
              </span>
            )}
          </div>

          {productData?.quantitySold > 0 && (
            <div className="w-full mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-red-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (productData.quantitySold / 100) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sold: {productData.quantitySold}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(Product));
