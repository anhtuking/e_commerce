import React, { useEffect, useState, memo } from "react";
import icons from "utils/icons";
import { apiGetProducts } from "api/product";
import { formatPrice, renderStarFromNumber, secondsToHms } from "utils/helpers";
import Countdown from "../common/Countdown";
import moment from "moment";
import { Link } from "react-router-dom";
import withBase from "hocs/withBase";

const { MdOutlineStar, TiThMenuOutline } = icons;
let idInterval
const DealDaily = ({navigate}) => {
  const [dealDaily, setDealDaily] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [expireTime, setExpireTime] = useState(false);

  const fetchDealDaily = async () => {
    try {
      const response = await apiGetProducts({
        limit: 1,
        page: Math.round(Math.random() * 10),
        totalRatings: 5,
      });
      if (response && response.success) {
        setDealDaily(response.dataProducts[0]);
        const today = `${moment().format('MM/DD/YYYY')} 2:00:00`
        const seconds = new Date(today).getTime() -new Date().getTime() + 24 * 3600 * 1000
        const number = secondsToHms(seconds)
        
        setHour(number.h);
        setMinute(number.m);
        setSecond(number.s);
      } else {
        setHour(0);
        setMinute(59);
        setSecond(59);
      }
    } catch (error) {
      console.error("Error fetching deal daily:", error);
      setHour(0);
      setMinute(59);
      setSecond(59);
    }
  };
  useEffect(() => {
    idInterval && clearInterval(idInterval)
    fetchDealDaily();
  }, [expireTime]);
  useEffect(() => {
    idInterval = setInterval(() => {
      // console.log("interval");
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
            setExpireTime(!expireTime);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, [hour, minute, second, expireTime]);
  
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <span className="text-xl font-bold text-gray-800">ƯU ĐÃI</span>
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
                dealDaily?.thumb ||
                "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
              }
              alt={dealDaily?.title || "Deal of the day"}
              className="w-full h-[200px] object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {dealDaily?.price < dealDaily?.originalPrice && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {Math.round((1 - dealDaily?.price / dealDaily?.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        <div className="flex h-4 mt-4 justify-center">
          {renderStarFromNumber(dealDaily?.totalRatings, 20)?.map((el, index) => (
            <span key={index}>{el}</span>
          ))}
        </div>
        
        {dealDaily && (
          <Link 
            to={`/${dealDaily?.category?.toLowerCase()}/${dealDaily?._id}/${dealDaily?.title}`}
            className="line-clamp-1 text-center pt-3 font-medium text-gray-800 hover:text-main transition-colors"
          >
            {dealDaily?.title}
          </Link>
        )}
        
        <div className="flex items-center gap-2 pt-2">
          <span className="font-bold text-red-600 text-lg">{dealDaily ? `${formatPrice(dealDaily?.price)} VND` : "Loading..."}</span>
          {dealDaily?.price < dealDaily?.originalPrice && (
            <span className="text-xs text-gray-500 line-through">{formatPrice(dealDaily?.originalPrice)} VND</span>
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
              navigate(`/${dealDaily?.category?.toLowerCase()}/${dealDaily?._id}/${dealDaily?.title}`);
            }}
            className="flex-1 flex gap-2 items-center justify-center bg-main hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition-colors"
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
