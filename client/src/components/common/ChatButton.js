import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import path from 'utils/path';
import icons from 'utils/icons';

const { RiRobot3Line  } = icons;
const DraggableChatButton = () => {
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatButtonRef = useRef(null);

  // Handle mouse down to start dragging
  const handleMouseDown = (e) => {
    if (chatButtonRef.current) {
      const rect = chatButtonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // Handle mouse move to update position while dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Ensure button stays within viewport boundaries
      const maxX = window.innerWidth - 60; // Button width
      const maxY = window.innerHeight - 60; // Button height
      
      setPosition({
        x: Math.max(10, Math.min(newX, maxX)),
        y: Math.max(10, Math.min(newY, maxY))
      });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Adjust button position if window is resized
  useEffect(() => {
    const handleResize = () => {
      setPosition(prevPosition => ({
        x: Math.min(prevPosition.x, window.innerWidth - 60),
        y: Math.min(prevPosition.y, window.innerHeight - 60)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={chatButtonRef}
      className="fixed flex items-center justify-center z-50 cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseDown={handleMouseDown}
    >
      <Link
        to={`/${path.CHATBOT_DETAILS}`}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-red-800 text-white hover:bg-red-600 transition-colors shadow-lg"
        aria-label="Chatbot"
        onClick={(e) => isDragging && e.preventDefault()}
      >
        <RiRobot3Line  size={24} />
      </Link>
    </div>
  );
};

export default DraggableChatButton; 