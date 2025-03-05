import React from "react";
import {
  Sidebar,
  Banner,
  BestSellers,
  DealDaily,
  FeatureProducts,
  // CustomSlider,
} from "../../components";
import { useSelector } from "react-redux";
import icons from "../../utils/icons";

const { IoMdArrowDropright } = icons;

const Home = () => {
  // const {newProducts} = useSelector(state => state.products);
  const { categories } = useSelector((state) => state.app);
  console.log(categories);

  return (
    <>
      <div className="w-main flex ">
        <div className="flex flex-col gap-5 w-[25%] flex-auto">
          <Sidebar />
          <DealDaily />
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[75%] h-[80%] flex-auto ">
          <Banner />
          <BestSellers />
        </div>
      </div>
      <div className="my-8">
        <FeatureProducts />
      </div>
      <div className="my-8 w-full">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          {" "}
          HOT COLLECTIONS{" "}
        </h3>
        <div className="grid grid-cols-3 gap-6 mt-6">
          {categories?.filter(el => el.brand.length > 0)?.map((el) => (
            <div key={el._id} className="border p-4 flex items-center">
              <img
                src={el?.image}
                alt=""
                className="w-[200px] h-[200px] object-contain mr-4"
              />
              <div>
                <h4 className="font-bold text-lg">{el.title}</h4>
                <ul className="list-none text-gray-600">
                  {el?.brand?.map((item) => (
                    <li key={item} className="mt-1 flex items-center gap-1">
                      <IoMdArrowDropright className="text-gray-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-8 w-full">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
          BLOGS POST
        </h3>
      </div>
      {/* <div className="w-full h-[500px] bg-main">FOOTER</div>   */}
    </>
  );
};

export default Home;
