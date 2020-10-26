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
      return error.response &&
        error.response.data &&
        error.response.data.message
        ? Promise.reject(error.response.data.message)
        : Promise.reject(error.message)
    }
  }
)

export default {
  get(url, config = {}) {
    return axios({
      method: 'get',
      url,
      ...config
    }) //.catch(catchMiddleware)
  },
  post(url, data, config = {}) {
    return axios({
      method: 'post',
      url,
      data,
      ...config
    }) //.catch(catchMiddleware)
  },
  put(url, data, config = {}) {
    return axios({
      method: 'put',
      url,
      data,
      ...config
    }) //.catch(catchMiddleware)
  },
  patch(url, data, config = {}) {
    return axios({
      method: 'patch',
      url,
      data,
      ...config
    }) //.catch(catchMiddleware)
  },
  delete(url, config = {}) {
    return axios({
      method: 'delete',
      url,
      ...config
    }) //.catch(catchMiddleware)
  }
}
