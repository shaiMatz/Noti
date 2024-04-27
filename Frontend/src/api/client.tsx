import axios from 'axios';

//export const APIURL = "http://192.168.136.1:3000"; 
export const APIURL = "http://10.100.102.114:3000"; //home
//export const APIURL = "http://192.168.136.1:3000";


const apiClient = axios.create({
  baseURL: APIURL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export default apiClient;
