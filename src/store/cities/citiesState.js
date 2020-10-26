import { citiesFactory } from '@/factory'

const state = {
  cities: citiesFactory(),
  searchCities: citiesFactory(),
  preferences: [],
  preferredCities: citiesFactory(),
  countries: [],
  cancelReques: undefined,
  capitalCities: []
}

export default state
