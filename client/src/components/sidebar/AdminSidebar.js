import React, { Fragment, memo, useState, useEffect } from "react";
import avatarAdmin from "assets/avatarAdmin.jpg";
import { adminSidebar } from "utils/contants";
import { Link, NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import { AiFillCaretDown, AiFillCaretLeft } from "react-icons/ai";
import logo2 from '../../assets/logo2.png';
import { FiMenu } from "react-icons/fi";

const AdminSidebar = () => {
  const [actived, setActived] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Pre-open parent menu if a child route is active
    const currentPath = location.pathname;
    adminSidebar.forEach(item => {
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
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-700">
        <Link className={`flex items-center justify-center mt-4 transition-all duration-300 ${collapsed ? 'scale-75' : ''}`} to={'/'}>
          <img
            src={logo2}
            alt="Admin Logo"
            className={`${collapsed ? 'w-10' : 'w-32'} transition-all duration-300`}
          />
        </Link>
        
        <div className={`flex items-center mt-3 overflow-hidden transition-all duration-300 ${collapsed ? 'w-0' : 'w-full'}`}>
          <small className="text-white font-semibold text-center whitespace-nowrap text-xl pl-20">
            ADMIN WORKSPACE
          </small>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {adminSidebar.map((el) => (
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
                  className={`flex items-center justify-between px-2 py-3 cursor-pointer transition-all duration-200 rounded-lg
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
                    <div className="absolute left-full top-0 ml-1 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-20">
                      {el.text}
                    </div>
                  )}
                </div>
                
                {actived.some(id => +id === +el.id) && !collapsed && (
                  <div className="overflow-hidden transition-all duration-300 max-h-40">
                    <div className="flex flex-col pl-10 pr-4 space-y-1">
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
      <div className={`p-4 border-t border-gray-700 text-center text-gray-400 text-xs ${collapsed ? 'hidden' : 'block'}`}>
        <p>© {new Date().getFullYear()} Admin Panel</p>
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
