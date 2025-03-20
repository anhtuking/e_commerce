import React, { memo, useState } from "react";
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
  const { current } = useSelector(state => state.user)
  const handleClickOption = async (e, flag) => {
    e.stopPropagation()
    if (flag === 'CART') {
      if (!current) {
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
      } else {
        const response = await apiUpdateCart({
          pid: productData._id,
          quantity: 1,
          color: productData.color || 'Default',
        })
        if (response.success) {
          toast.success(response.mes)
          dispatch(getCurrent())
        } else {
          toast.error(response.mes)
        }
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
    <div className="w-full text-base px-[10px] font-main2">
      <div
        className="w-full border p-[15px] flex flex-col items-center"
        onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
        onMouseEnter={e => {
          e.stopPropagation()
          setIsShowOption(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setIsShowOption(false)
        }}>
        <div className="w-full relative">
          {isShowOption && <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
            <span title="Quick View" onClick={(e) => handleClickOption(e, 'VIEW')}><SelectOption icon={<FaEye />} /></span>
            {current?.cart?.some(
              el => el.product === productData._id.toString()) 
              ? <span title="Added to cart"><SelectOption icon={<BsCartCheckFill color="red"/>} /></span> 
              : <span title="Add to cart" onClick={(e) => handleClickOption(e, 'CART')}><SelectOption icon={<FaCartPlus />} /></span>}
            <span title="Add to wishlist" onClick={(e) => handleClickOption(e, 'WISHLIST')}><SelectOption icon={<FaHeart />} /></span>
          </div>}
          <img
            src={
              productData?.thumb || "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
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
