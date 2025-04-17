import React, { memo } from "react";
import avatar from "assets/avatar_default.png";
import moment from "moment";
import { renderStarFromNumber } from "utils/helpers";

const Comment = ({image, name = 'Anonymous', updatedAt, comment, star, postedBy}) => {
  // Use customer's avatar if available, otherwise use default avatar
  const displayImage = postedBy?.avatar || image || avatar;
  
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-all">
      <div className="flex-none">
        <img
          src={displayImage}
          alt="avatar"
          className="w-10 h-10 object-cover rounded-full border-2 border-gray-100"
        />
      </div>
      <div className="flex flex-col flex-auto">
        {/* Header with name and time */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <span className="text-xs text-gray-500 italic">{moment(updatedAt)?.fromNow()}</span>
        </div>
        
        {/* Rating stars */}
        <div className="flex items-center gap-1 mb-2">
          <span className="flex items-center gap-1">
            {renderStarFromNumber(star)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
        </div>
        
        {/* Comment text */}
        <div className="p-3 bg-gray-100 rounded-lg text-gray-700">
          <p className="text-sm leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(Comment);
