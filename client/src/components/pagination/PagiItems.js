import React, { memo } from "react";
import clsx from "clsx";
import { createSearchParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";

const PagiItems = ({ children }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation()
  const handlePagination = () => {
    const queries = Object.fromEntries([...params])
    if (Number(children)) queries.page = children;
    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString()
    })
  };
  return (
    <button
      className={clsx(
        "w-10 h-10 flex items-center justify-center ",
        !Number(children) && "items-end",
        Number(children) && "items-center justify-center hover:rounded-full hover:bg-gray-300",
        +params.get('page') === +children && 'rounded-full bg-gray-300',
        !+params.get('page') && +children === 1 && 'rounded-full bg-gray-300'
      )}
      onClick={handlePagination}
      type="button"
      disabled = {!Number(children)}
    >
      {children}
    </button>
  );
};

export default memo(PagiItems);
