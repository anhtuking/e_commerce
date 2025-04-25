import React, { Fragment, memo, useState, useEffect } from "react";
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
    <div className={`bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 h-full transition-all duration-500 ease-in-out ${collapsed ? 'w-20' : 'w-[327px]'} flex flex-col font-main2 shadow-2xl relative overflow-hidden rounded-r-xl`}>
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-0"></div>
      
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 z-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      {/* Collapse button */}
      <button
        onClick={toggleCollapse}
        className="absolute top-4 right-4 p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg z-20 transition-all duration-300 hover:rotate-180 cursor-pointer"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-4 border-b border-white/10 relative z-10">
        <Link className={`flex items-center justify-center transition-all duration-300 ${collapsed ? 'scale-75' : ''}`} to={'/'}>
          <img
            src={logo2}
            alt="Admin Logo"
            className={`${collapsed ? 'w-12 h-12 object-contain' : 'w-44 h-auto object-contain'} transition-all duration-300 drop-shadow-lg hover:scale-105`}
          />
        </Link>
        
        <div className={`flex items-center justify-center mt-2 overflow-hidden transition-all duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'}`}>
          <h2 className="text-white font-bold text-center whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300 text-xl px-4">
            ADMIN WORKSPACE
          </h2>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent relative z-10">
        {adminSidebar.map((el) => (
          <Fragment key={el.id}>
            {el.type === "SINGLE" && (
              <NavLink
                to={el.path}
                className={({ isActive }) => 
                  clsx(
                    "group relative transition-all duration-300 my-2 mx-1 rounded-xl overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  )
                }
              >
                <div className={`flex items-center px-4 py-3.5 ${collapsed ? 'justify-center' : ''}`}>
                  <span className={`text-xl transition-transform duration-300 ${collapsed ? 'scale-125' : ''}`}>{el.icon}</span>
                  <span className={`ml-3 whitespace-nowrap transition-all duration-300 font-medium ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    {el.text}
                  </span>
                </div>
                
                {/* Tooltip for collapsed menu */}
                {collapsed && (
                  <div className="absolute left-full top-0 ml-2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-20 shadow-lg">
                    {el.text}
                  </div>
                )}
              </NavLink>
            )}
            
            {el.type === "PARENT" && (
              <div className="my-2 mx-1 rounded-xl overflow-hidden">
                <div 
                  className={`flex items-center justify-between px-4 py-3.5 cursor-pointer transition-all duration-300 rounded-xl
                    ${actived.some(id => id === el.id) 
                      ? 'bg-gradient-to-r from-indigo-700 to-indigo-900 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'} 
                    ${collapsed ? 'justify-center' : ''}`
                  }
                  onClick={() => !collapsed && handleShowTabs(+el.id)}
                >
                  <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
                    <span className={`text-xl transition-transform duration-300 ${collapsed ? 'scale-125' : ''}`}>{el.icon}</span>
                    <span className={`ml-3 whitespace-nowrap transition-all duration-300 font-medium ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
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
                    <div className="absolute left-full top-0 ml-2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-20 shadow-lg">
                      {el.text}
                      <div className="mt-2 flex flex-col space-y-1">
                        {el.submenu.map((item) => (
                          <Link key={item.text} to={item.path} className="text-xs text-gray-300 hover:text-white">
                            - {item.text}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {actived.some(id => +id === +el.id) && !collapsed && (
                  <div className="overflow-hidden transition-all duration-500 max-h-80 animate-fadeIn">
                    <div className="flex flex-col pl-12 pr-4 space-y-1.5 py-2 bg-gray-800/30 rounded-b-xl">
                      {el.submenu.map((item) => (
                        <NavLink
                          key={item.text}
                          to={item.path}
                          onClick={(e) => e.stopPropagation()}
                          className={({ isActive }) => 
                            clsx(
                              "px-3 py-2.5 rounded-lg transition-all duration-300 text-sm",
                              isActive
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-md"
                                : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:translate-x-1"
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
      <div className={`p-4 border-t border-white/10 text-center text-gray-400 text-xs transition-all duration-300 relative z-10 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center space-y-1">
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-2"></div>
          <p>© {new Date().getFullYear()} Admin Panel</p>
          <p>Version 2.0</p>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminSidebar);