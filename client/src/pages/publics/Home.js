import React from "react";
import { Sidebar, Banner, BestSellers } from "../../components";


const Home = () => {
  return (
    <div className="w-main flex ">
      <div className="flex flex-col gap-5 w-[20%] flex-auto">
        <Sidebar />
        <span>Deal daily</span>
      </div>
      <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto  ">
        <Banner />
        <BestSellers/>
      </div>
    </div>
  );
};

export default Home;
