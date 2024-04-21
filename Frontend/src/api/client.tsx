import axios from 'axios';

export const APIURL = "http://192.168.136.1:3000";

const apiClient = axios.create({
  baseURL: APIURL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export default apiClient;
