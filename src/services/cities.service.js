import Request from './Request'
import axios from 'axios'

const PATH = {
  CITIES: '/cities',
  PREFERENCES: '/preferences/cities',
  COUNTRIES: 'https://restcountries.eu/rest/v2/all?fields=name;capital;flag'
}

const getCities = payload => {
  const offset = payload.offset
  const limit = payload.limit
  let queryParams = `offset=${offset}&limit=${limit}`

  const filter = payload.filter
  queryParams += filter ? `&filter=${filter}` : ''
  return Request.get(`${PATH.CITIES}?${queryParams}`)
}

const getCityById = cityId => {
  return Request.get(`${PATH.CITIES}/${cityId}`)
}

const saveCities = payload => {
  return Request.patch(`${PATH.PREFERENCES}`, payload)
}

const getPreferences = () => {
  return Request.get(`${PATH.PREFERENCES}`)
}

const getCountries = () => {
  return axios.get(`${PATH.COUNTRIES}`)
}

export default {
  getCities,
  getCityById,
  saveCities,
  getPreferences,
  getCountries
}
