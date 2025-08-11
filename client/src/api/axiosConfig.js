import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://api.payly.it/api",
    timeout: 10000,
    withCredentials: true
})

export default apiClient;
