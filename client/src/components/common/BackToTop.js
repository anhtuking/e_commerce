import React, { useState, useEffect, useRef } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const scrollContainerRef = useRef(null);
  const isScrollingRef = useRef(false);

  const smoothScrollToTop = () => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;
    
    const container = scrollContainerRef.current;
    const startPosition = container ? container.scrollTop : window.pageYOffset;
    const startTime = performance.now();
    const duration = 800;
    
    const animateScroll = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const position = startPosition * (1 - easeProgress);
      
      container ? (container.scrollTop = position) : window.scrollTo(0, position);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isScrollingRef.current = false;
        if (container) {
          container.scrollTop = 0;
        } else {
          window.scrollTo(0, 0);
        }
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const layoutContainer = document.querySelector('.max-h-screen.overflow-y-auto');
    scrollContainerRef.current = layoutContainer || null;

    const container = scrollContainerRef.current;
    const toggleVisible = () => {
      const scrolled = container 
        ? container.scrollTop 
        : (document.documentElement.scrollTop || window.pageYOffset);
      setVisible(scrolled > 100);
    };
    
    (container || window).addEventListener("scroll", toggleVisible);
    toggleVisible();
    
    return () => (container || window).removeEventListener("scroll", toggleVisible);
  }, []);

  return (
    <div className="fixed bottom-10 right-10 z-1000 group cursor-pointer">
      {visible && (
        <>
          <div
            onClick={smoothScrollToTop}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-red-700 text-white hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:scale-110 active:scale-95 relative z-10"
          >
            <FaArrowUp className="text-xl" />
          </div>
        </>
      )}
    </div>
  );
};

export default BackToTop; 