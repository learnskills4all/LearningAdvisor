import axios from "axios";

/**
 * Create axios instance to be used in the rest of API
 * In the constant declaration of the API
 * Two different baseURL's are used:
 * http://localhost:5000/ is used for development mode,
 * https://tabackend.azurewebsites.net is used for production mode
 */

const API =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? axios.create({
        withCredentials: true,
        baseURL: "http://localhost:5000/api",
      })
    : axios.create({
        withCredentials: true,
        baseURL: "https://testing.brack-it.nl/api/",
      });

export default API;
