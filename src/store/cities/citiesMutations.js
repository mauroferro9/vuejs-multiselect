const mutations = {
  setCities(state, cities) {
    state.cities.data.push(...cities.data)
    state.cities.links = cities.links
    state.cities.total = cities.total
  },
  setPreferences(state, preferences) {
    state.preferences = preferences
  }
}

export default mutations
