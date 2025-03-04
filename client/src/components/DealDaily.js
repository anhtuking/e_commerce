import React, { useEffect, useState, memo } from "react";
import icons from "../utils/icons";
import { apiGetProducts } from "../api/product";
import { formatPrice, renderStarFromNumber, secondsToHms } from "../utils/helpers";
import Countdown from "./Countdown";
import moment from "moment";

const { MdOutlineStar, TiThMenuOutline } = icons;
let idInterval
const DealDaily = () => {
  const [dealDaily, setDealDaily] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [expireTime, setExpireTime] = useState(false);

  const fetchDealDaily = async () => {
    const response = await apiGetProducts({
      limit: 1,
      page: Math.round(Math.random() * 10),
      totalRatings: 5,
    });
    if (response.success) {
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
    <div className="w-full h-[50px] border flex-auto p-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <span>
            <MdOutlineStar color="#dd1111" className="animate-blink" />
          </span>
          <span>
            <MdOutlineStar color="#dd1111" className="animate-blink" />
          </span>
          <span>
            <MdOutlineStar color="#dd1111" className="animate-blink" />
          </span>
        </div>
        <span className="font-semibold text-[20px]">DAILY DEALS</span>
        <div className="flex space-x-2">
          <span>
            <MdOutlineStar color="#dd1111" className="animate-blink" />
          </span>
          <span>
            <MdOutlineStar color="#dd1111" className="animate-blink" />
          </span>
          <span>
            <MdOutlineStar color="#dd1111" className="animate-blink" />
          </span>
        </div>
      </div>
      <div className="w-full, flex flex-col items-center px-4 pt-8">
        <img
          src={
            dealDaily?.thumb ||
            "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
          }
          alt=""
          className="w-full object-contain"
        />
        <span className="flex h-4">
          {renderStarFromNumber(dealDaily?.totalRatings, 20)}
        </span>
        <span className="line-clamp-1 text-center pt-4">{dealDaily?.title}</span>
        <span className="pt-4">{`${formatPrice(dealDaily?.price)} VND`}</span>
      </div>
      <div className="px-4 mt-4 mb-8">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Countdown unit={"Hours"} number={hour} />
          <Countdown unit={"Minutes"} number={minute} />
          <Countdown unit={"Seconds"} number={second} />
        </div>
        <button
          type="button"
          className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2"
        >
          <TiThMenuOutline />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
};

export default memo(DealDaily);
