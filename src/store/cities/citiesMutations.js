import { citiesFactory } from '@/factory'

const mutations = {
  setCities(state, cities) {
    state.searchCities = citiesFactory()
    state.cities.data.push(...cities.data)
    state.cities.links = cities.links
    state.cities.total = cities.total
  },
  setPreferences(state, preferences) {
    state.preferences = preferences
  },
  addPreference(state, cityId) {
    state.preferences.data.push(cityId)
    state.preferences.total++
  },
  removePreference(state, cityId) {
    state.preferences.data = state.preferences.data.filter(p => p !== cityId)
    state.preferences.total--
  },
  setPreferredCities(state, preferredCities) {
    state.preferredCities.data.push(...preferredCities)
    state.preferredCities.links = preferredCities.links
    state.preferredCities.total = preferredCities.total
  },
  addPreferredCity(state, city) {
    state.preferredCities.data.push(city)
    state.preferredCities.total++
  },
  removePreferredCity(state, cityId) {
    const cityIndex = state.preferredCities.data.findIndex(
      city => city.geonameid.toString() === cityId
    )
    state.preferredCities.data.splice(cityIndex, 1)
    state.preferredCities.total--
  },
  setSearchCities(state, payload) {
    state.cities = citiesFactory()
    const searchCities = payload.data
    if (payload.newSearch) {
      state.searchCities.data = searchCities.data
    } else {
      //loading more
      const ids = new Set(state.searchCities.data.map(city => city.geonameid))
      state.searchCities.data = [
        ...state.searchCities.data,
        ...searchCities.data.filter(city => !ids.has(city.geonameid))
      ]
      state.searchCities.links = searchCities.links
      state.searchCities.total = searchCities.total
    }
  },
  setCountries(state, countries) {
    let countryMap = {}
    countries.forEach(
      country => (countryMap[country.name.toLowerCase()] = country)
    )
    state.countries = countryMap
  }
}

export default mutations
