import axios from 'axios';

axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  
  if (token) {
    console.log("🔑 Token found and added to request:", token); // Log the token to check
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn("⚠️ No token found in sessionStorage.");
  }

  return config;
}, error => {
  return Promise.reject(error);
});

export default axios;
