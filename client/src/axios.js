import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
    withCredentials: true,
    timeout: 30000 // Increase timeout for vector search operations
  });
  
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Logging API requests in development
    if (process.env.NODE_ENV === 'development') {
    console.log('API request to:', config.url);
    }
    
    // Do something before request is sent
    let localStorageData = window.localStorage.getItem('persist:shop/user')
    if(localStorageData && typeof localStorageData === 'string') {
      try {
        localStorageData = JSON.parse(localStorageData)
        const accessToken = JSON.parse(localStorageData?.token)
        if (accessToken) {
          config.headers = {authorization: `Bearer ${accessToken}`}
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    return config;
  }, function (error) {
    // Do something with request error
    console.error('Request error:', error);
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    if (process.env.NODE_ENV === 'development') {
    console.log('API response from:', response.config.url, response.status);
    }
    
    // Check if response data is valid
    if (response.data === undefined) {
      console.error('Empty response data from:', response.config.url);
      return Promise.reject({
        success: false,
        mes: 'Empty response data',
        status: response.status
      });
    }
    
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error('Response error:', error.config?.url, error.response?.status);
    
    // Log detailed error info for debugging
    if (process.env.NODE_ENV === 'development') {
      if (error.response) {
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject({
        success: false,
        mes: error.response.data?.mes || error.response.data?.message || 'Server error',
        status: error.response.status
      });
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({
        success: false,
        mes: 'Lỗi kết nối',
        details: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại.',
        status: 503
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({
        success: false,
        mes: 'Lỗi kết nối',
        details: error.message || 'Đã xảy ra lỗi không xác định',
        status: 500
      });
    }
  });

export default instance;