import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:8080', 
});

api.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    console.log("Request Headers:", config.headers); // 👈 In toàn bộ headers để kiểm tra
    return config;
  },
  error => Promise.reject(error)
);
// Thêm interceptor để xử lý phản hồi lỗi
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response ? error.response.status : null;

    // if (status === 401 || status === 403) {
    //   // Chuyển hướng đến trang http://localhost:3000/
    //   window.location.href = 'http://localhost:3000/';
    // }

    return Promise.reject(error);
  }
);


export default api;