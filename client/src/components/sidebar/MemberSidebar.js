import React, { Fragment, memo, useState, useEffect } from "react";
import { memberSidebar } from "utils/contants";
import { Link, NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import { AiFillCaretDown, AiFillCaretLeft } from "react-icons/ai";
import { FiChevronLeft, FiUser } from "react-icons/fi";
import { RiShieldUserLine } from "react-icons/ri";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import avatar from 'assets/avatar_default.png';
import { useSelector } from "react-redux";

const MemberSidebar = () => {
  const [actived, setActived] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const { current } = useSelector(state => state.user);
  const location = useLocation();

  useEffect(() => {
    // Pre-open parent menu if a child route is active
    const currentPath = location.pathname;
    memberSidebar.forEach(item => {
      if (item.type === "PARENT" && item.submenu) {
        const isChildActive = item.submenu.some(subItem => currentPath === subItem.path);
        if (isChildActive && !actived.includes(item.id)) {
          setActived(prev => [...prev, item.id]);
        }
      }
    });
  }, [location, actived]);

  const handleShowTabs = (tabId) => {
    if (actived.some(el => el === tabId)) {
      setActived(prev => prev.filter(el => el !== tabId));
    } else {
      setActived(prev => [...prev, tabId]);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl h-full transition-all duration-300 ${collapsed ? 'w-20' : 'w-[327px]'} flex flex-col font-main2 shadow-xl relative overflow-hidden border border-gray-200 dark:border-gray-800`}>
      {/* Collapse button */}
      <button
        onClick={toggleCollapse}
        className="absolute top-4 right-4 p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-sm z-10 transition-all duration-200"
      >
        <FiChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-100 dark:border-gray-800 relative">
        <div className="relative group cursor-pointer">
          <div className="rounded-full p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="overflow-hidden rounded-full bg-white dark:bg-gray-900 p-0.5">
              <img
                src={current?.avatar || avatar}
                alt="User avatar"
                className="w-[70px] h-[70px] object-cover rounded-full transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>
          
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900"></div>
        </div>
        
        <div className={`flex flex-col items-center mt-4 transition-all duration-300 overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
          <h3 className="text-gray-800 dark:text-white font-semibold text-base truncate max-w-[180px]">
            {`${current?.firstname || 'Guest'} ${current?.lastname || ''}`}
          </h3>
          <span className="text-gray-500 dark:text-gray-400 text-xs mt-1 flex items-center">
            <RiShieldUserLine className="mr-1" /> Member
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {memberSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({ isActive }) => 
                  clsx(
                    "group relative transition-all duration-200 my-1.5 rounded-lg overflow-hidden flex items-center",
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )
                }
              >
                <div className={`flex items-center px-4 py-2.5 ${collapsed ? 'justify-center' : ''}`}>
                  <span className={`text-xl ${collapsed ? 'mx-auto' : ''}`}>{el.icon}</span>
                  <span className={`ml-3 font-medium text-sm whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    {el.text}
                  </span>
                </div>
                
                {/* Tooltip for collapsed menu */}
                {collapsed && (
                  <div className="absolute left-full top-0 ml-2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20 shadow-lg">
                    {el.text}
                  </div>
                )}
              </NavLink>
            )}
            
            {el.type === "PARENT" && (
              <div className="my-1.5 rounded-lg overflow-hidden">
                <div 
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-200 rounded-lg
                    ${actived.some(id => id === el.id) ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} 
                    ${collapsed ? 'justify-center' : ''}`
                  }
                  onClick={() => !collapsed && handleShowTabs(+el.id)}
                >
                  <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
                    <span className={`text-xl ${collapsed ? 'mx-auto' : ''}`}>{el.icon}</span>
                    <span className={`ml-3 text-sm whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                      {el.text}
                    </span>
                  </div>
                  
                  {!collapsed && (
                    <span className="transform transition-transform duration-300">
                      {actived.some(id => id === el.id) ? <AiFillCaretDown className="text-gray-500" /> : <AiFillCaretLeft className="text-gray-500" />}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed menu */}
                  {collapsed && (
                    <div className="absolute left-full top-0 ml-2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20 shadow-lg">
                      {el.text}
                    </div>
                  )}
                </div>
                
                {actived.some(id => +id === +el.id) && !collapsed && (
                  <div className="overflow-hidden transition-all duration-300 max-h-60">
                    <div className="flex flex-col pl-10 pr-4 space-y-1 pb-2 pt-1">
                      {el.submenu.map((item) => (
                        <NavLink
                          key={item.text}
                          to={item.path}
                          onClick={(e) => e.stopPropagation()}
                          className={({ isActive }) => 
                            clsx(
                              "px-3 py-2 rounded-md transition-all duration-200 text-sm",
                              isActive
                                ? "bg-blue-500 text-white font-medium"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            )
                          }
                        >
                          {item.text}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>
      
      {/* Footer */}
      <div className={`py-4 px-4 border-t border-gray-100 dark:border-gray-800 ${collapsed ? 'hidden' : 'block'}`}>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
          <p className="text-gray-800 dark:text-gray-300 text-sm font-medium mb-3">
            Need help with your account?
          </p>
          <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 rounded-lg text-white text-sm font-medium shadow-sm hover:shadow">
            <Link to={`/`} className="block">Contact Support</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(MemberSidebar);
