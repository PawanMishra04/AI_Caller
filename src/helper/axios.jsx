import axios from "axios";
const ApiAxios = axios.create({
    // baseURL: "http://45.120.138.243:8008/",
        // baseURL: "https://aicaller.gaurangatech.com/api/",
    baseURL: "https://api.maitriai.com/ai_assistant",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // "ngrok-skip-browser-warning": true,
    },

  });    

  
  export default ApiAxios;
  // baseURL: "https://api.maitriai.com/maitri_assistant",
