import React, { memo } from "react";
import usePagination from "../hooks/usePagination";
import { PagiItems } from "../components";

const Pagination = ({ totalCount }) => {
  const pagination = usePagination(66, 2);
  return (
    <div className=" flex justify-center mt-6">
      {pagination?.map((el) => (
        <PagiItems key={el}>{el}</PagiItems>
      ))}
    </div>
  );
};

export default memo(Pagination);
