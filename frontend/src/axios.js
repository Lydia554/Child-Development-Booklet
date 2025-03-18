import axios from 'axios';


axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
 
  if (process.env.NODE_ENV !== 'production') {
    if (token) {
      console.log("🔑 Token found and added to request:", token);
    } else {
      console.warn("⚠️ No token found in sessionStorage.");
    }
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

export default axios;
