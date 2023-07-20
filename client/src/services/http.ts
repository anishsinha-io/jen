import axios from "axios";

export const getBaseClientURL = () => {
    const DEV_CLIENT_URL = "http://localhost";
    const PROD_CLIENT_URL = "";

    if (process.env.NODE_ENV == "development") return DEV_CLIENT_URL;
    return PROD_CLIENT_URL;
};

export const getBaseApiURL = () => {
    const DEV_API_URL = "http://localhost/api";
    const PROD_API_URL = "";

    if (process.env.NODE_ENV == "development") return DEV_API_URL;
    return PROD_API_URL;
};

export const http = axios.create({
    withCredentials: true,
    baseURL: getBaseApiURL(),
});
