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
  searchCities: state => {
    return state.searchCities
  },
  countries: state => {
    return state.countries
  }
}

export default getters
