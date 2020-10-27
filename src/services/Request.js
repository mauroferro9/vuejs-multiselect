import axios from 'axios'
import { BACKEND_URL } from '@/constants'

axios.defaults.baseURL = BACKEND_URL

axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    if (error && error.message === 'cancelled') {
      //custom messages
      return Promise.reject(error.message)
    } else {
      return Promise.reject(error.response)
    }
  }
)

export default {
  get(url, config = {}) {
    return axios({
      method: 'get',
      url,
      ...config
    })
  },
  post(url, data, config = {}) {
    return axios({
      method: 'post',
      url,
      data,
      ...config
    })
  },
  put(url, data, config = {}) {
    return axios({
      method: 'put',
      url,
      data,
      ...config
    })
  },
  patch(url, data, config = {}) {
    return axios({
      method: 'patch',
      url,
      data,
      ...config
    })
  },
  delete(url, config = {}) {
    return axios({
      method: 'delete',
      url,
      ...config
    })
  }
}
