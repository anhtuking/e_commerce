import { useMemo } from "react";
import { generateRange } from "../utils/helpers";

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
  const paginationArray = useMemo(() => {
    const pageSize = Number(process.env.REACT_APP_LIMIT) || 10;
    const totalPageCount = Math.ceil(totalProductCount / pageSize);
    const totalPageNumbers = siblingCount + 5;

    // Nếu tổng số trang nhỏ hơn số phần tử phân trang cần hiển thị thì hiển thị hết
    if (totalPageNumbers >= totalPageCount) {
      return generateRange(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = generateRange(1, leftItemCount);
      return [...leftRange, "dots", lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = generateRange(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = generateRange(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "dots", ...middleRange, "dots", lastPageIndex];
    }
  }, [totalProductCount, currentPage, siblingCount]);

  return paginationArray;
};

export default usePagination;
