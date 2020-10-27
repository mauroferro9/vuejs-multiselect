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
    state.searchCities = citiesFactory()

    const searchCities = payload.data
    state.searchCities.data.push(...searchCities.data)
    state.searchCities.links = searchCities.links
    state.searchCities.total = searchCities.total
  },
  setCountries(state, countries) {
    let countryMap = {}
    countries.forEach(
      country => (countryMap[country.name.toLowerCase()] = country)
    )
    state.countries = countryMap
    state.capitalCities = countries.map(c => c.capital.toLowerCase())
  },
  cleanCities(state) {
    state.cities = citiesFactory()
    state.searchCities = citiesFactory()
  },
  setCancelRequest(state, cancelRequest) {
    state.cancelRequest = cancelRequest
  }
}

export default mutations
