import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4000'
axios.interceptors.request.use(config => {
    config.withCredentials = true;
    return config;
}, err => {
    return Promise.reject(err)
})
axios.interceptors.response.use(response => {
    return response.data
})