import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8000/ibob/',
  baseURL: 'https://scs-inventory-1.onrender.com/'
  //   timeout: 10000, // Adjust the timeout as needed
});

try {

  var token = JSON.parse(localStorage.getItem("access_token"));

  if(token){
  
    api.interceptors.request.use(async (config) => {
    
      try {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      } catch {
        console.log("Login to use this");
      }
    
  });
  }

} catch (err) {
  console.log(err);
}

export default api;
