import { useMemo } from "react";
import { generateRange } from "../utils/helpers";
import { BiDotsHorizontal } from "react-icons/bi";

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
  const paginationArray = useMemo(() => {
    const pageSize = process.env.REACT_APP_PRODUCT_LIMIT || 10;
    const paginationCount = Math.ceil(totalProductCount / pageSize);
    const totalPaginationItem = siblingCount + 5;

    // [1,2,3,4,5,6]
    if (paginationCount <= totalPaginationItem)
      return generateRange(1, paginationCount);

    const isShowLeft = currentPage - siblingCount > 2;
    const isShowRight = currentPage + siblingCount < paginationCount - 1;
    // [1,...,6,7,8,9,10]
    if (isShowLeft && !isShowRight) {
      const rightStart = paginationCount - 4;
      const rightRange = generateRange(rightStart, paginationCount);
      return [1, <BiDotsHorizontal />, ...rightRange];
    }
    // [1,2,3,4,5,...,10]
    if (!isShowLeft && isShowRight) {
      const leftRange = generateRange(1, 5);
      return [...leftRange, <BiDotsHorizontal />, paginationCount];
    }

    const siblingLeft = Math.max(currentPage - siblingCount, 1);
    const siblingRight = Math.min(currentPage + siblingCount, paginationCount);
    // [1,...,5,6,7,...,10]
    if (isShowLeft && isShowRight) {
      const middleRange = generateRange(siblingLeft, siblingRight);
      return [
        1,
        <BiDotsHorizontal />,
        ...middleRange,
        <BiDotsHorizontal />,
        paginationCount,
      ];
    }
  }, [totalProductCount, currentPage, siblingCount]);
  return paginationArray;
};

export default usePagination;
