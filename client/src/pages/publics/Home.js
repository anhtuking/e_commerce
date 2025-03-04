import React from "react";
import { Sidebar, Banner, BestSellers, DealDaily } from "../../components";

const Home = () => {
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
      <div className="w-full h-[500px]" />
    </>
  );
};

export default Home;
