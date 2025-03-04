import React from "react";
import { formatPrice, renderStarFromNumber } from "../utils/helpers";

// const ProductCard = ({ image, title, totalRatings, price }) => {
//   return (
//     <div className="w-1/3 p-4">
//       <div className="rounded-lg p-4 flex items-center gap-4">
//         <img src={image} alt={title} className="w-[90px] object-contain" />
        
//       </div>
//     </div>
//   );
// };


const ProductCard = ({ image, title, totalRatings, price }) => {
    return (
      <div className="w-1/3 p-4">
        <div className="rounded-lg p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
          <img
            src={image}
            alt={title}
            className="w-[90px] object-contain transition-transform duration-300 hover:scale-105 hover:brightness-110"
          />
          <div className="flex flex-col text-sm">
          <span className="flex h-4">{renderStarFromNumber(totalRatings)}</span>
          <span className="capitalize font-semibold">{title}</span>
          <span className="text-red-500 font-bold">{`${formatPrice(price)} VND`}</span>
        </div>
        </div>
      </div>
    );
  };

export default ProductCard;
