import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
    withCredentials: true,
    timeout: 10000
  });
  
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    console.log('API request to:', config.url);
    
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
    console.log('API response from:', response.config.url, response.status);
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error('Response error:', error.config?.url, error.response?.status);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        message: error.response.data?.mes || 'Server error',
        statusCode: error.response.status,
        mes: error.response.data?.mes || 'Server error'
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message: 'No response from server. Please check your connection',
        mes: 'No response from server. Please check your connection',
        statusCode: 503
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        message: error.message || 'Unknown error occurred',
        mes: error.message || 'Unknown error occurred',
        statusCode: 500
      };
    }
  });

  export default instance