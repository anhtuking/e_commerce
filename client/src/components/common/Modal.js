import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "store/app/appSlice";

const Modal = ({ children }) => {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() =>
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
      }
      className="fixed inset-0 bg-overlay z-[1500] flex items-center justify-center"
    >
      {children}
    </div>
  );
};

export default memo(Modal);
