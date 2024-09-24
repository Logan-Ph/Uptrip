import axios from 'axios';
// const BASE_URL = 'https://up-trip-server.vercel.app';
const BASE_URL = 'http://localhost:4000';

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

