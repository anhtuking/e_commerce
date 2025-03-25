import React, { Fragment, memo, useState, useEffect } from "react";
import { memberSidebar } from "utils/contants";
import { Link, NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import { AiFillCaretDown, AiFillCaretLeft } from "react-icons/ai";
import { FiChevronLeft, FiUser } from "react-icons/fi";
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
    <div className={`bg-gradient-to-b from-gray-800 to-gray-900 h-full w-[327px] transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col font-main2 shadow-xl relative overflow-hidden`}>
      {/* Collapse button */}
      <button
        onClick={toggleCollapse}
        className="absolute top-4 right-4 p-1 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-md z-10"
      >
        <FiChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-700 relative">
        <div className="relative group">
          <div className="rounded-full p-1 bg-gradient-to-r from-red-500 to-red-600">
            <div className="overflow-hidden rounded-full bg-gray-800 p-0.5">
              <img
                src={current?.avatar || avatar}
                alt="User avatar"
                className="w-16 h-16 object-cover rounded-full transition-all duration-300 group-hover:scale-110"
              />
            </div>
          </div>
          
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-800"></div>
        </div>
        
        <div className={`flex flex-col items-center mt-4 transition-all duration-300 overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
          <h3 className="text-white font-medium text-base truncate max-w-[150px]">
            {`${current?.firstname || 'Guest'} ${current?.lastname || ''}`}
          </h3>
          <span className="text-gray-400 text-xs mt-1 flex items-center">
            <FiUser className="mr-1" /> Member
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {memberSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({ isActive }) => 
                  clsx(
                    "group relative transition-all duration-200 my-1 mx-2 rounded-lg overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700"
                  )
                }
              >
                <div className={`flex items-center px-4 py-3 ${collapsed ? 'justify-center' : ''}`}>
                  <span className="text-xl">{el.icon}</span>
                  <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    {el.text}
                  </span>
                </div>
                
                {/* Tooltip for collapsed menu */}
                {collapsed && (
                  <div className="absolute left-full top-0 ml-2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-20">
                    {el.text}
                  </div>
                )}
              </NavLink>
            )}
            
            {el.type === "PARENT" && (
              <div className="my-1 mx-2 rounded-lg overflow-hidden">
                <div 
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg
                    ${actived.some(id => id === el.id) ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'} 
                    ${collapsed ? 'justify-center' : ''}`
                  }
                  onClick={() => !collapsed && handleShowTabs(+el.id)}
                >
                  <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
                    <span className="text-xl">{el.icon}</span>
                    <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                      {el.text}
                    </span>
                  </div>
                  
                  {!collapsed && (
                    <span className="transform transition-transform duration-300">
                      {actived.some(id => id === el.id) ? <AiFillCaretDown /> : <AiFillCaretLeft />}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed menu */}
                  {collapsed && (
                    <div className="absolute left-full top-0 ml-2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-20">
                      {el.text}
                    </div>
                  )}
                </div>
                
                {actived.some(id => +id === +el.id) && !collapsed && (
                  <div className="overflow-hidden transition-all duration-300 max-h-40">
                    <div className="flex flex-col pl-10 pr-4 space-y-1 pb-2 pt-1">
                      {el.submenu.map((item) => (
                        <NavLink
                          key={item.text}
                          to={item.path}
                          onClick={(e) => e.stopPropagation()}
                          className={({ isActive }) => 
                            clsx(
                              "px-3 py-2 rounded-md transition-all duration-200",
                              isActive
                                ? "bg-red-500 text-white font-medium"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
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
      <div className={`py-4 px-4 border-t border-gray-700 ${collapsed ? 'hidden' : 'block'}`}>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <p className="text-gray-300 text-xs">
            Need help with your orders?
          </p>
          <button className="mt-2 w-full py-1.5 bg-red-500 hover:bg-red-600 transition-colors duration-200 rounded text-white text-xs font-medium">
            <Link to={`/`}>Contact Support</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(MemberSidebar);
