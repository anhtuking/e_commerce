import React, { Fragment, memo, useState } from "react";
import { memberSidebar } from "utils/contants";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { AiFillCaretDown, AiFillCaretLeft  } from "react-icons/ai";
import avatar from 'assets/avatar_default.png'
import { useSelector } from "react-redux";

const activeStyle =
  "px-4 py-2 flex items-center gap-2 text-gray-800 font-bold bg-gray-100";
const notActiveStyle =
  "px-4 py-2 flex items-center gap-2 text-gray-200 font-bold hover:bg-gray-600";

const MemberSidebar = () => {
    const [actived, setActived] = useState([])
    const {current} = useSelector(state => state.user)
    const handlShowTabs = (tabId) => { 
        if (actived.some(el => el === tabId)) setActived(prev => prev.filter(el => el !== tabId))
            else setActived(prev => [...prev, tabId])
     }
  return (
    <div className="py-4 bg-zinc-700 h-full flex flex-col font-main2">
      <div className="flex flex-col items-center justify-center p-4 gap-2">
        <div className="w-full flex flex-col items-center justify-center p-4">
          <img
            src={current?.avatar || avatar}
            alt="Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
        <small className="mt-2 text-white font-semibold text-xl">{`${current?.firstname} ${current?.lastname}`}</small>
      </div>
      <div>
        {memberSidebar.map((el) => (
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

export default memo(MemberSidebar);
