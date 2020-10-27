import { citiesFactory } from '@/factory'

const state = {
  cities: citiesFactory(),
  searchCities: citiesFactory(),
  preferences: [],
  preferredCities: citiesFactory(),
  cancelRequest: undefined,
  countries: [],
  capitalCities: []
}

export default state
