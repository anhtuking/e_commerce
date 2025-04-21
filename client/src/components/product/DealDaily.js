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
 const DealDaily = ({navigate, dispatch}) => {
   const [hour, setHour] = useState(0);
   const [minute, setMinute] = useState(0);
   const [second, setSecond] = useState(0);
   const [expireTime, setExpireTime] = useState(false);
   const { dealDaily } = useSelector((state) => state.products);

   // Debug: log dealDaily.data và totalRatings mỗi khi thay đổi
   useEffect(() => {
      if (dealDaily?.data) {
        console.log("🔥 dealDaily.data:", dealDaily?.data);
        console.log("🔥 totalRatings:", dealDaily?.data?.totalRatings);
      }
  }, [dealDaily]);
 
   const fetchDealDaily = async () => {
     const response = await apiGetProducts({
       limit: 20,
       sort: "-totalRatings",
     });
     if (response?.success) {
       const randomProduct = response?.dataProducts[Math.round(Math.random() * 20)]
       dispatch(
          getDealDaily({data: randomProduct, time: Date.now() + 24 * 60 * 60 * 1000})
       );
     }
   };
   useEffect(() => {
     if (dealDaily){
      const deltaTime = dealDaily?.time - Date.now();
      const number = secondsToHms(deltaTime);
       setHour(number.h);
       setMinute(number.m);
       setSecond(number.s);
     }
   }, [dealDaily]);
   useEffect(() => {
     idInterval && clearInterval(idInterval);
     if (moment(moment(dealDaily?.time).format("MM/DD/YYYY HH:mm:ss")).isBefore(moment())) {
      fetchDealDaily();
     }
   }, [expireTime]);
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
             setExpireTime(!expireTime);
           }
         }
       }
     }, 1000);
     return () => {
       clearInterval(idInterval);
     };
   }, [hour, minute, second, expireTime]);

   const handleViewProduct = () => {
     if (dealDaily?.data?._id) {
       navigate(`/products/${dealDaily?.data?._id}/${dealDaily?.data?.title}`);
     }
   };

   return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 border border-gray-200">
       <div className="flex items-center justify-center pb-4">
        <img src={sale} alt="title"  />
       </div>
       <div className="w-full flex flex-col items-center px-4 pt-8">
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
         <span className="pt-4 text-main font-semibold">{`${formatPrice(dealDaily?.data?.price)}`}</span>
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