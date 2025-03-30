import axios from 'axios';
const apiShipper = axios.create({
  baseURL: 'http://localhost:8080/shipper', 
}); 
export default apiShipper;