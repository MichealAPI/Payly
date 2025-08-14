import axios from 'axios';

const isProd = import.meta.env.PROD;

const apiClient = axios.create({
    baseURL: isProd ? "https://api.payly.it/api" : "http://localhost:5000/api",
    timeout: 10000,
    withCredentials: true
})

export default apiClient;
