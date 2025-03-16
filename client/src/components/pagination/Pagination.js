import React, { memo } from "react";
import usePagination from "hooks/usePagination";
import { PagiItems } from "components";
import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, params.get('page') || 1);

  const range = () => { 
    const currentPage = +params.get("page")
    const pageSize = +process.env.REACT_APP_LIMIT || 10
    const start = ((currentPage - 1) * pageSize) + 1
    const end = Math.min(currentPage * pageSize, totalCount)

    return `${start} - ${end}`
   }
   
  return (
    <div className="flex w-full justify-between items-center">
      {!+params.get("page") ? (
        <span className="text-sm italic">{`Show 1 - ${
          Math.min(+process.env.REACT_APP_LIMIT, totalCount) || 10
        } of ${totalCount}`}</span>
      ):''}
      {+params.get("page") ? (
        <span className="text-sm italic">{`Show ${range()} of ${totalCount}`}</span>
      ):''}
      <div className=" flex items-center mt-6">
        {pagination?.map((el) => (
          <PagiItems key={el}>{el}</PagiItems>
        ))}
      </div>
    </div>
  );
};

export default memo(Pagination);
