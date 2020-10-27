const getters = {
  cities: state => {
    return state.cities
  },
  preferences: state => {
    return state.preferences
  },
  preferredCities: state => {
    return state.preferredCities
  },
  preferredCitiesIds: state => {
    return state.preferredCities.data.map(pc => pc.geonameid)
  },
  searchCities: state => {
    return state.searchCities
  },
  countries: state => {
    return state.countries
  },
  capitalCities: state => {
    return state.capitalCities
  }
}

export default getters
