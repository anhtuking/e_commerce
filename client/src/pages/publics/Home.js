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
  const { categories } = useSelector((state) => state.app);
  // console.log(categories);
  // const { isLoggedIn, current } = useSelector((state) => state.user);
  // console.log({isLoggedIn, current});

  return (
    <>
      <div className="w-main flex font-main2  ">
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
        <h3 className="text-[20px] py-[15px] border-b-2 border-main font-semibold">
          {" "}
          HOT COLLECTIONS{" "}
        </h3>
        <div className="grid grid-cols-3 gap-6 mt-6 font-main2">
          {categories?.filter(el => el.brand.length > 0)?.map((el) => (
            <div key={el._id} className="border p-4 flex items-center uppercase">
              <img
                src={el?.image}
                alt=""
                className="w-[200px] h-[200px] object-contain mr-4"
              />
              <div>
                <h4 className="text-lg">{el.title}</h4>
                <ul className="list-none text-gray-600">
                  {el?.brand?.map((item) => (
                    <li className="mt-1 flex items-center gap-1">
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
        <h3 className="text-[20px] py-[15px] border-b-2 border-main">
          BLOG POSTS
        </h3>
      </div>
    </>
  );
};

export default Home;
