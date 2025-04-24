import React, { useEffect, useState, memo } from "react";
import { apiGetProducts } from "api/product";
import { formatPrice, renderStarFromNumber, secondsToHms } from "utils/helpers";
import Countdown from "components/common/Countdown";
import icons from "utils/icons";
import moment from "moment";
import { useSelector } from "react-redux";
import withBase from "hocs/withBase";
import { getDealDaily } from "store/product/productSlice";
import sale from "assets/sale.png";

const { TiThMenuOutline } = icons;
let idInterval
const DealDaily = ({ navigate, dispatch }) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  // const [expireTime, setExpireTime] = useState(false);
  const { dealDaily } = useSelector((state) => state.products);

  const fetchDealDaily = async () => {
    const response = await apiGetProducts({
      limit: 20,
      sort: "-totalRatings",
    });
    if (response?.success) {
      const randomProduct = response?.dataProducts[Math.round(Math.random() * 20)]
      let next2am = moment().hour(2).minute(0).second(0);
      if (moment().isAfter(next2am)) {
        next2am = next2am.add(1, 'day');
      }
      dispatch(
        getDealDaily({
          data: randomProduct,
          time: next2am.valueOf()
        })
      );
    }
  };
  //1. effect cập nhật giờ/phút/giây từ dealDaily.time
  useEffect(() => {
    if (dealDaily) {
      const { h, m, s } = secondsToHms(dealDaily.time - Date.now());
      setHour(h);
      setMinute(m);
      setSecond(s);
    }
  }, [dealDaily]);
  // 2. effect "hẹn giờ" reset đúng 2 AM
  useEffect(() => {
    if (!dealDaily?.time) return;
    const now = Date.now();
    const delay = dealDaily.time - now;
    const timeoutId = setTimeout(fetchDealDaily, delay);
    return () => clearTimeout(timeoutId);
  }, [dealDaily.time]);
  // 3. effect chạy interval mỗi giây để đếm ngược UI
  useEffect(() => {
    idInterval = setInterval(() => {
      if (second > 0) {
        setSecond((prev) => prev - 1);
      } else {
        if (minute > 0) {
          setMinute((prev) => prev - 1);
          setSecond(59);
        } else {
          if (hour > 0) {
            setHour((prev) => prev - 1);
            setMinute(59);
            setSecond(59);
          } else {
            clearInterval(idInterval);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, [hour, minute, second]);

  const handleViewProduct = () => {
    if (dealDaily?.data?._id) {
      navigate(`/products/${dealDaily?.data?._id}/${dealDaily?.data?.title}`);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-center pb-4">
        <img src={sale} alt="title" />
      </div>
      <div className="w-full flex flex-col items-center px-4 pt-8 mb-4">
        <img
          src={
            dealDaily?.data?.thumb ||
            "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
          }
          alt=""
          className="w-full object-contain"
        />
        <span className="flex h-4 mt-4">
          {renderStarFromNumber(dealDaily?.data?.totalRatings)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}
        </span>
        <span className="line-clamp-1 text-center pt-4">{dealDaily?.data?.title}</span>
        <span className="pt-4 pb-8 text-main font-semibold">{`${formatPrice(dealDaily?.data?.price)}`}</span>
      </div>
      <div className="px-2 mt-2 mb-2">
        <div className="flex justify-center items-center gap-2 mb-3 relative">
          {/* Countdown title */}
          <div className="absolute -top-6 left-0 right-0 text-center">
            <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">Kết thúc sau</span>
          </div>
          
          {/* Animated separator dots */}
          <Countdown unit={"Giờ"} number={hour} />
          <div className="flex flex-col justify-center items-center h-full">
            <div className="w-1 h-1 bg-gray-400 rounded-full mb-1 animate-pulse"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
          <Countdown unit={"Phút"} number={minute} />
          <div className="flex flex-col justify-center items-center h-full">
            <div className="w-1 h-1 bg-gray-400 rounded-full mb-1 animate-pulse"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
          <Countdown unit={"Giây"} number={second} />
        </div>
        <button
          type="button"
          className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-sm"
          onClick={handleViewProduct}
        >
          <TiThMenuOutline />
          <span>Xem ngay</span>
        </button>
      </div>
    </div>
  );
};

export default withBase(memo(DealDaily));