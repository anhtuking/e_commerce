import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import path from "utils/path";
import { useSelector } from "react-redux";
import { MemberSidebar } from "components";

const MemberLayout = () => {
  const { isLoggedIn, current } = useSelector(state => state.user);
  if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />;
  return (
    <div className="flex w-full bg-gray-200 min-h-screen relative text-gray-800">
          <div className="w-[327px] top-0 bottom-0 flex-none fixed">
            <MemberSidebar />
          </div>
          <div className="w-[327px]"></div>
          <div className="flex-auto">
            <Outlet />
          </div>
        </div>
  );
};

export default MemberLayout;
