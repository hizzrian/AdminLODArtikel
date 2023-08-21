import router from '@/router'
import axios from 'axios'

const axiosIns = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,

  // headers: {'X-Custom-Header': 'foobar'}
})

axiosIns.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')

  if (token && !config.publicEndpoint) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`
  }

  return config
})

axiosIns.interceptors.response.use(response => {
  // console.log(response)
  return response
}, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('userData')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userAbilities')
    router.push('/login')
  } else {
    return Promise.reject(error)
  }
})

export default axiosIns
