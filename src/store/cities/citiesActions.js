import CitiesService from '@/services/cities.service'

const actions = {
  getCities({ state, commit }, payload) {
    if (state.cancelRequest) {
      state.cancelRequest('cancelled')
    }
    const executor = c => {
      commit('setCancelRequest', c)
    }
    return CitiesService.getCities(payload, executor).then(response => {
      const isSearch = payload.filter
      if (isSearch) {
        commit('setSearchCities', {
          data: response.data,
          newSearch: payload.newSearch
        })
      } else {
        commit('setCities', response.data)
      }
      commit('setCancelRequest', undefined)
      return response.data
    })
  },
  saveCities({ commit }, cities) {
    return CitiesService.saveCities(cities).then(async () => {
      const cityId = Object.keys(cities)[0]
      const isAdding = cities[cityId]

      if (isAdding) {
        commit('addPreference', cityId)
        const cityInfo = await CitiesService.getCityById(cityId)
        commit('addPreferredCity', cityInfo.data)
      } else {
        commit('removePreference', cityId)
        commit('removePreferredCity', cityId)
      }
    })
  },
  getPreferences({ commit, dispatch }) {
    return CitiesService.getPreferences()
      .then(async response => {
        commit('setPreferences', response.data)
        let citiesIds = response.data && response.data.data

        await dispatch('getCitiesInfo', citiesIds)
      })
      .catch(error => {
        throw error
      })
  },
  getCountries({ commit }) {
    return CitiesService.getCountries().then(response => {
      commit('setCountries', response.data)
      return response.data
    })
  },

  async getCitiesInfo({ commit }, citiesIds) {
    let promises
    let allFulfilled = false
    let remainingTries = 2

    while (remainingTries > 0 && !allFulfilled) {
      promises = []
      citiesIds.forEach(cityId => {
        promises.push(CitiesService.getCityById(cityId))
      })
      // get all fav cities info
      const results = await Promise.allSettled(promises)

      // commit fulfilled data
      const fulfilled = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value.data)
      commit('setPreferredCities', fulfilled)

      // retry rejected
      citiesIds = results
        .filter(result => result.status === 'rejected')
        .map(r =>
          r.reason.config.url.substring(
            r.reason.config.url.lastIndexOf('/') + 1
          )
        )

      allFulfilled = citiesIds.length === 0
      remainingTries--
    }
    if (!allFulfilled) {
      Promise.reject('Could not load all favorites cities info')
    }
  }
}

export default actions
