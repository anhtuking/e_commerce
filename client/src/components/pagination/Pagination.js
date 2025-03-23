import React, { memo, useCallback } from "react";
import usePagination from "hooks/usePagination";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

const Pagination = ({ totalCount }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = Number(params.get("page")) || 1;
  const pageSize = Number(process.env.REACT_APP_LIMIT) || 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginationRange = usePagination(totalCount, currentPage);

  const handlePageChange = useCallback((page) => {
    if (page === currentPage) return; // Không thay đổi nếu đang ở trang hiện tại
    
    const queries = Object.fromEntries([...params]);
    queries.page = page;
    navigate({
      pathname: location.pathname,
      search: new URLSearchParams(queries).toString(),
    });
  }, [currentPage, location.pathname, navigate, params]);

  const range = useCallback(() => {
    const start = Math.min((currentPage - 1) * pageSize + 1, totalCount);
    const end = Math.min(currentPage * pageSize, totalCount);
    return `${start} - ${end}`;
  }, [currentPage, pageSize, totalCount]);
  
  // Nếu chỉ có 1 trang hoặc không có sản phẩm, không hiển thị phân trang
  if (totalCount <= pageSize || totalCount === 0) {
    return (
      <div className="flex justify-end items-center p-4">
        <span className="text-sm italic pl-2">
          {totalCount > 0 ? `Showing ${totalCount} of ${totalCount}` : "No results found"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center p-4">
      <span className="text-sm italic mb-4 md:mb-0 pl-2">
        {`Showing ${range()} of ${totalCount}`}
      </span>
      <div className="flex items-center space-x-2 pr-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-200 transition-colors"
        >
          PREVIOUS
        </button>

        {paginationRange?.map((item, index) => {
          if (typeof item === "number") {
            return (
              <button
                key={`page-${item}`}
                onClick={() => handlePageChange(item)}
                className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 transition-colors ${
                  currentPage === item
                    ? "bg-sky-900 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            );
          } else {
            return (
              <span
                key={`dots-${index}`}
                className="w-10 h-10 flex items-center justify-center"
              >
                ...
              </span>
            );
          }
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition-colors"
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default memo(Pagination);
