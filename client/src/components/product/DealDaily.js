import React, { useEffect, useState, memo, useRef } from "react";
import icons from "utils/icons";
import { apiGetProducts } from "api/product";
import { formatPrice, renderStarFromNumber, secondsToHms } from "utils/helpers";
import Countdown from "../common/Countdown";
import { Link } from "react-router-dom";
import withBase from "hocs/withBase";
import { useSelector } from "react-redux";
import { getDealDaily } from "store/product/productSlice";

const { MdOutlineStar, TiThMenuOutline } = icons;

const DealDaily = ({ navigate, dispatch }) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [expireTime, setExpireTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { dealDaily } = useSelector(state => state.products);
  const intervalRef = useRef(null);

  // Hàm tính khoảng thời gian từ hiện tại đến 2 giờ sáng của ngày hôm sau
  const calculateTimeTo2AM = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  };

  // Hàm fetch sản phẩm deal mới và cập nhật thời gian reset (2 giờ sáng hôm sau)
  const fetchDealdaily = async () => {
    setIsLoading(true);
    try {
      const response = await apiGetProducts({
        limit: 20,
        sort: "-totalRatings",
        page: Math.floor(Math.random() * 5) + 1,
      });

      if (response && response.success && response.dataProducts?.length > 0) {
        const validProducts = response.dataProducts.filter(
          (product) => product && product.title && product.price && product.thumb
        );

        if (validProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * validProducts.length);
          const selectedProduct = validProducts[randomIndex];

          // Tính thời gian reset (2 giờ sáng của ngày hôm sau)
          const nextResetTime = new Date();
          nextResetTime.setDate(nextResetTime.getDate() + 1);
          nextResetTime.setHours(2, 0, 0, 0);

          // Cập nhật state Redux với sản phẩm và thời gian hết hạn
          dispatch(getDealDaily({
            data: selectedProduct,
            time: nextResetTime.getTime(),
          }));

          // Cập nhật đồng hồ đếm ngược dựa vào thời gian hiện tại
          const timeRemaining = calculateTimeTo2AM();
          const number = secondsToHms(timeRemaining);
          setHour(number.h);
          setMinute(number.m);
          setSecond(number.s);
        }
      } else {
        // Nếu không có dữ liệu hợp lệ, đặt giá trị mặc định
        setHour(23);
        setMinute(59);
        setSecond(59);
      }
    } catch (error) {
      console.error("Error fetching deal daily:", error);
      setHour(23);
      setMinute(59);
      setSecond(59);
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra xem deal hiện tại đã hết hạn hay chưa
  const checkDealExpired = () => {
    if (!dealDaily?.time) return true;
    return Date.now() >= dealDaily.time;
  };

  // Khi component mount, nếu chưa có deal hoặc deal đã hết hạn, fetch deal mới
  useEffect(() => {
    if (!dealDaily?.data || checkDealExpired()) {
      fetchDealdaily();
    } else {
      const timeRemaining = dealDaily.time - Date.now();
      if (timeRemaining > 0) {
        const { h, m, s } = secondsToHms(timeRemaining);
        setHour(h);
        setMinute(m);
        setSecond(s);
      } else {
        fetchDealdaily();
      }
      setIsLoading(false);
    }
  }, []);

  // Khi expireTime hoặc dealDaily thay đổi, cập nhật lại đồng hồ đếm ngược
  useEffect(() => {
    if (dealDaily?.data && dealDaily?.time) {
      const timeRemaining = dealDaily.time - Date.now();
      if (timeRemaining > 0) {
        const { h, m, s } = secondsToHms(timeRemaining);
        setHour(h);
        setMinute(m);
        setSecond(s);
      } else {
        fetchDealdaily();
      }
    }
  }, [expireTime, dealDaily]);

  // Bộ đếm thời gian sử dụng interval; khi hết thời gian, sẽ fetch deal mới
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecond((prevSecond) => {
        if (prevSecond > 0) return prevSecond - 1;
        else {
          if (minute > 0) {
            setMinute((prevMinute) => prevMinute - 1);
            return 59;
          } else {
            if (hour > 0) {
              setHour((prevHour) => prevHour - 1);
              setMinute(59);
              return 59;
            } else {
              // Khi đồng hồ đếm ngược về 0, fetch deal mới và cập nhật trạng thái
              fetchDealdaily();
              setExpireTime((prev) => !prev);
              return 0;
            }
          }
        }
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [hour, minute, second]);

  const hasValidProductData =
    dealDaily?.data &&
    dealDaily.data.title &&
    dealDaily.data.price &&
    dealDaily.data.thumb &&
    dealDaily.data._id;

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <span className="text-xl font-bold text-gray-800">ƯU ĐÃI NGÀY</span>
        <div className="flex items-center space-x-2">
          <MdOutlineStar color="#dd1111" size={20} className="animate-blink" />
          <MdOutlineStar color="#dd1111" size={20} className="animate-blink" />
          <MdOutlineStar color="#dd1111" size={20} className="animate-blink" />
        </div>
      </div>

      <div className="w-full flex flex-col items-center pt-2">
        <div className="relative w-full max-w-[200px] group">
          <div className="overflow-hidden rounded-lg">
            <img
              src={
                hasValidProductData
                  ? dealDaily.data.thumb
                  : "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
              }
              alt={hasValidProductData ? dealDaily.data.title : "Deal of the day"}
              className="w-full h-[200px] object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {hasValidProductData && dealDaily.data.price < dealDaily.data.originalPrice && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {Math.round((1 - dealDaily.data.price / dealDaily.data.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>

        <div className="flex h-4 mt-4 justify-center items-center">
          {hasValidProductData && (
            <>
              <div className="flex text-yellow-400">
                {renderStarFromNumber(dealDaily.data.totalRatings, 18)?.map((el, index) => (
                  <span key={index}>{el}</span>
                ))}
              </div>
              <span className="text-xs text-gray-600 ml-1">
                ({dealDaily.data.totalRatings || 0})
              </span>
            </>
          )}
        </div>

        {hasValidProductData ? (
          <Link
            to={`/${dealDaily.data.category?.toLowerCase()}/${dealDaily.data._id}/${dealDaily.data.title}`}
            className="line-clamp-1 text-center pt-3 font-medium text-gray-800 hover:text-main transition-colors"
          >
            {dealDaily.data.title}
          </Link>
        ) : (
          <div className="pt-3 text-center">
            {isLoading ? "Đang tải..." : "Không có ưu đãi"}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          {isLoading ? (
            <span className="font-bold text-red-600 text-lg">Đang tải...</span>
          ) : hasValidProductData ? (
            <>
              <span className="font-bold text-red-600 text-lg">
                {formatPrice(dealDaily.data.price)} VND
              </span>
              {dealDaily.data.price < dealDaily.data.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(dealDaily.data.originalPrice)} VND
                </span>
              )}
            </>
          ) : (
            <span className="font-medium text-gray-500">Không có dữ liệu</span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-center items-center gap-2 mb-6">
          <Countdown unit={"Hours"} number={hour} />
          <Countdown unit={"Minutes"} number={minute} />
          <Countdown unit={"Seconds"} number={second} />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (hasValidProductData) {
                const encodedTitle = encodeURIComponent(dealDaily.data.title.replace(/\s+/g, '-'));
                navigate(`/${dealDaily.data.category?.toLowerCase()}/${dealDaily.data._id}/${encodedTitle}`);
              }
            }}
            disabled={!hasValidProductData || isLoading}
            className={`flex-1 flex gap-2 items-center justify-center ${
              !hasValidProductData || isLoading ? "bg-gray-400" : "bg-main hover:bg-gray-800"
            } text-white font-medium py-3 px-4 rounded-md transition-colors`}
          >
            <TiThMenuOutline />
            <span>Xem ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(DealDaily));