import React, { useState } from 'react';
import { SlLike, SlDislike } from "react-icons/sl";
import axios from 'axios';

/**
 * Component hiển thị nút phản hồi đơn giản cho câu trả lời AI
 * @param {Object} props - Props của component
 * @param {string} props.query - Câu hỏi người dùng
 * @param {string} props.response - Câu trả lời của AI
 * @param {string} props.queryType - Loại truy vấn
 * @param {Object} props.sessionInfo - Thông tin phiên
 * @param {Object} props.responseStats - Thống kê về câu trả lời
 * @returns {JSX.Element}
 */
const FeedbackButtons = ({ 
  query, 
  response, 
  queryType = 'unknown',
  sessionInfo,
  responseStats
}) => {
  // State quản lý phản hồi đã chọn
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  // State loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State thông báo
  const [message, setMessage] = useState('');

  /**
   * Xử lý khi người dùng nhấn nút phản hồi
   * @param {number} rating - Đánh giá (1: positive, 0: negative)
   */
  const handleFeedback = async (rating) => {
    try {
      setIsSubmitting(true);
      setSelectedFeedback(rating);
      
      // Chuẩn bị dữ liệu gửi lên server
      const feedbackData = {
        query,
        response,
        queryType,
        rating,
        additionalFeedback: '',
        sessionInfo,
        responseStats
      };

      // Gửi request lên server
      await axios.post('/api/feedback', feedbackData);
      
      // Hiển thị thông báo thành công
      setMessage(rating === 1 
        ? 'Cảm ơn phản hồi tích cực của bạn!' 
        : 'Cảm ơn phản hồi của bạn.'
      );
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      setMessage('Đã xảy ra lỗi khi gửi phản hồi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Hiển thị nếu chưa chọn phản hồi */}
      {!selectedFeedback ? (
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">Câu trả lời này có hữu ích không?</p>
          <button
            onClick={() => handleFeedback(1)}
            className="p-1.5 text-gray-700 hover:bg-green-100 rounded-full"
            disabled={isSubmitting}
            aria-label="Hữu ích"
          >
            <SlLike size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => handleFeedback(0)}
            className="p-1.5 text-gray-700 hover:bg-red-100 rounded-full"
            disabled={isSubmitting}
            aria-label="Không hữu ích"
          >
            <SlDislike size={20} className="text-gray-700" />
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-600">{message}</div>
      )}
    </div>
  );
};

export default FeedbackButtons; 