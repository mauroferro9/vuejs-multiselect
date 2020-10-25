import Request from './Request'

const PATH = {
  CITIES: '/cities',
  PREFERENCES: '/preferences/cities'
}

const getCities = payload => {
  const offset = payload.offset
  const limit = payload.limit
  return Request.get(`${PATH.CITIES}?offset=${offset}&limit=${limit}`)
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

export default {
  getCities,
  getCityById,
  saveCities,
  getPreferences
}
