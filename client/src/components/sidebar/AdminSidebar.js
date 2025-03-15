import React, { Fragment, memo, useState } from "react";
import avatarAdmin from "assets/avatarAdmin.jpg";
import { adminSidebar } from "utils/contants";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { AiFillCaretDown, AiFillCaretLeft  } from "react-icons/ai";

const activeStyle =
  "px-4 py-2 flex items-center gap-2 text-gray-800 font-bold bg-gray-200";
const notActiveStyle =
  "px-4 py-2 flex items-center gap-2 text-gray-200 font-bold hover:bg-gray-600";

const AdminSidebar = () => {
    const [actived, setActived] = useState([])
    const handlShowTabs = (tabId) => { 
        if (actived.some(el => el === tabId)) setActived(prev => prev.filter(el => el !== tabId))
            else setActived(prev => [...prev, tabId])
     }
  return (
    <div className="py-4 bg-zinc-800 h-full flex flex-col font-main2">
      <div className="flex flex-col items-center justify-center p-4 gap-2">
        <img
          src={avatarAdmin}
          alt="Admin Avatar"
          className="w-[100px] h-[100px] object-cover rounded-full border-2 border-white"
        />
        <small className="mt-2 text-white font-semibold text-xl">ADMIN WORKSPACE</small>
      </div>
      <div>
        {adminSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({isActive}) => clsx(isActive && activeStyle, !isActive && notActiveStyle)}>
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}
            {el.type === "PARENT" && (
              <div className="flex flex-col text-gray-200 font-bold text-medium" onClick={() => handlShowTabs(+el.id)} >
                <div className="flex items-center px-4 py-2 justify-between hover:bg-gray-600 cursor-pointer">
                  <div className="flex items-center gap-2">
                  <span>{el.icon}</span>
                  <span>{el.text}</span>
                  </div>
                  {actived.some(id => id === el.id) ? <AiFillCaretDown /> : <AiFillCaretLeft />}
                </div>
                {actived.some(id => +id === +el.id) && <div className="flex flex-col pl-6">
                  {el.submenu.map((item) => (
                    <NavLink
                      key={el.text}
                      to={item.path}
                      onClick={e => e.stopPropagation()}
                      className={({isActive}) => clsx( isActive && activeStyle, !isActive && notActiveStyle )}>
                      {item.text}
                    </NavLink>
                  ))}
                </div>}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
