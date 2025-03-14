import React, { memo, useEffect, useState } from "react";
import icons from "../utils/icons";
import { colors } from "../utils/contants";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { apiGetProducts } from "../api";
import useDebounce from "../hooks/useDebounce";

const { FaChevronDown } = icons;

const SearchItems = ({
  name,
  activeClick,
  changeActiveFilter,
  type = "checkbox",
}) => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [selected, setSelected] = useState([]);
  const [price, setPrice] = useState([0,0])
  const [bestPrice , setBestPrice ] = useState({
    from: '',
    to: ''
  })
  const handleSelect = (e) => {
    changeActiveFilter(null);
    const alreadyEl = selected.find((el) => el === e.target.value);
    if (alreadyEl)
      setSelected((prev) => prev.filter((el) => el !== e.target.value));
    else setSelected((prev) => [...prev, e.target.value]);
  };
  const fetchBestPriceProduct = async () => {
    const response = await apiGetProducts({sort: '-price', limit: 1})
    if (response.success) setBestPrice(response.dataProducts[0]?.price)
  }

  useEffect(() => {
    if (selected.length > 0) {
      navigate({
        pathname: `/${category}`,
        search: createSearchParams({
          color: selected.join(","),
        }).toString(),
      });
    } else {
      navigate(`/${category}`);
    }
  }, [selected, category, navigate]);

  useEffect(() => {
    if (type === 'input') fetchBestPriceProduct()
  }, [type])

  useEffect(() => { 
    if (price.from > price.to && price.from && price.to) alert('Price from cannot be higher than price to!')
   }, [price])

  const debouncePriceFrom = useDebounce(price.from, 500)
  const debouncePriceTo = useDebounce(price.to, 500)
  useEffect(() => {
    const data = {}
    if (Number(price.from) > 0) data.from = price.from
    if (Number(price.to) > 0) data.to = price.to
    
    // if (price.from > 0) {
        navigate({
          pathname: `/${category}`,
          search: createSearchParams(data).toString(),
        });
      // } else {
      //   navigate(`/${category}`);
      // }
  }, [debouncePriceFrom, debouncePriceTo,])

  return (
    <div
      className="relative text-xs p-3 gap-3 border-item flex justify-between items-center font-main2 text-gray-500 cursor-pointer hover:text-gray-800"
      onClick={() => changeActiveFilter(name)}
    >
      <span className="capitalize">{name}</span>
      <FaChevronDown />
      {activeClick === name && (
        <div className="absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border-item bg-[#dad6d6] min-w-[150px]">
          {/* filter color */}
          {type === "checkbox" && (
            <div className="">
              <div className="p-4 items-center justify-between flex gap-8 border-b">
                <span className="whitespace-nowrap text-black border-item">
                  {`${selected.length} selected`}
                </span>
                <span
                  className="border-item hover:text-black cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected([]);
                  }}
                >
                  Reset
                </span>
              </div>
              <div
                className="grid grid-cols-2 gap-3 mt-4 ml-5"
                onClick={(e) => e.stopPropagation()}
              >
                {colors.map((el, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      className="form-checkbox"
                      type="checkbox"
                      value={el}
                      onChange={handleSelect}
                      id={el}
                      checked={selected.some(
                        (selectedItem) => selectedItem === el
                      )}
                    />
                    <label htmlFor={el} className="capitalize text-gray-700">
                      {el}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* filter price  */}
          {type === 'input' && <div onClick={e=> e.stopPropagation()}>
            <div className="p-4 items-center justify-between flex gap-8 border-b" >
                <div className="flex flex-col ">
                  <span className="whitespace-nowrap text-black">
                      {`The highest price is <${Number(bestPrice).toLocaleString()}> VND`}
                  </span>
                  <span className="whitespace-nowrap text-gray-600">
                      {`You can filter products by price here.`}
                  </span>
                </div>
                <span
                  className="border-item hover:text-black cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrice({from: '', to: ''})
                    changeActiveFilter(null)
                  }}
                >
                  Reset
                </span>
              </div>
              <div className="flex items-center gap-2 p-2">
                <div className="flex items-center gap-2 font-main2 text-black font-semibold">
                    <label  htmlFor="from">From:</label>
                    <input className="form-input" type="number" id="from" value={price.from} onChange={e => setPrice(prev => ({...prev, from: e.target.value}))}/>
                </div>
                <div className="flex items-center gap-2 font-main2 text-black font-semibold">
                    <label htmlFor="to">To:</label>
                    <input className="form-input" type="number" id="to" value={price.to} onChange={e => setPrice(prev => ({...prev, to: e.target.value}))}/>
                </div>
              </div>
            </div>}
        </div>
      )}
    </div>
  );
};

export default memo(SearchItems);
