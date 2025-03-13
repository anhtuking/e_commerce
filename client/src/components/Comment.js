import React, { memo } from "react";
import avatar from "../assets/avatar_default.png";
import moment from "moment";
import { renderStarFromNumber } from "../utils/helpers";

const Comment = ({image = avatar, name = 'Anonymous', content, comment, star}) => {
  return (
    <div className="flex font-main2 gap-4">
      <div className="flex-none">
        <img
          src={image}
          alt="avatar"
          className="w-[30px] h-[30px] object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col flex-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{name}</h3>
          <span className="text-xs italic">{moment(content?.createdAt)?.fromNow()}</span>
        </div>
        <div className="flex flex-col gap-2 pl-4 text-sm mt-2 mb-4 border border-gray-300 py-2 bg-red-100">
          <span className="flex items-center gap-1">
            <span className="font-semibold">Rating:</span>
            <span className="flex items-center gap-1">
              {renderStarFromNumber(star)?.map((el, index) => (
                <span key={index}>{el}</span>
              ))}
            </span>
          </span>
          <span className="flex gap-1">
            <span className="font-semibold">Comment:</span>
            <span className="flex items-center gap-1">{comment}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Comment);
