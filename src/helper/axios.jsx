import axios from "axios";
const ApiAxios = axios.create({
    // baseURL: "http://192.168.29.82:8006/",
    baseURL: "http://192.168.29.253:8007/",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "ngrok-skip-browser-warning": true,
    },

  });    

  
  export default ApiAxios;
  // baseURL: "https://api.maitriai.com/maitri_assistant",
