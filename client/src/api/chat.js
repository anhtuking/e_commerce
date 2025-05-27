import axios from '../axios';

/**
 * Gửi phản hồi (like/dislike) về câu trả lời của chatbot
 * @param {Object} data - Dữ liệu phản hồi
 * @returns {Promise}
 */
export const apiSaveFeedback = (data) =>
  axios({
    url: '/chat/feedback',
    method: 'post',
    data,
  });

/**
 * Tìm câu trả lời tương tự đã được đánh giá cao
 * @param {Object} data - Dữ liệu tìm kiếm
 * @returns {Promise}
 */
export const apiFindSimilarResponse = (data) =>
  axios({
    url: '/chat/similar',
    method: 'get',
    params: data,
  });

/**
 * Lấy danh sách phản hồi được đánh giá cao (chỉ admin)
 * @param {Object} params - Tham số tìm kiếm
 * @returns {Promise}
 */
export const apiGetPositiveFeedbacks = (params) =>
  axios({
    url: '/chat/feedback/positive',
    method: 'get',
    params,
  });

/**
 * Lấy danh sách phản hồi được đánh giá thấp (chỉ admin)
 * @param {Object} params - Tham số tìm kiếm
 * @returns {Promise}
 */
export const apiGetNegativeFeedbacks = (params) =>
  axios({
    url: '/chat/feedback/negative',
    method: 'get',
    params,
  });

/**
 * Lưu toàn bộ cuộc trò chuyện
 * @param {Object} data - Dữ liệu cuộc trò chuyện
 * @returns {Promise}
 */
export const apiSaveConversation = (data) =>
  axios({
    url: '/chat/conversation',
    method: 'post',
    data,
  });

/**
 * Lấy cuộc trò chuyện theo ID
 * @param {string} id - ID của cuộc trò chuyện
 * @returns {Promise}
 */
export const apiGetConversationById = (id) =>
  axios({
    url: `/chat/conversation/${id}`,
    method: 'get',
  });
