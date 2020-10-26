import CitiesService from '@/services/cities.service'

const actions = {
  getCities({ state, commit }, payload) {
    if (state.cancelRequest) {
      state.cancelRequest('cancelled')
    }
    const executor = c => {
      state.cancelRequest = c
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
  getPreferences({ commit }) {
    return CitiesService.getPreferences()
      .then(async response => {
        commit('setPreferences', response.data)
        let promises = []
        let citiesIds = response.data && response.data.data

        // citiesIds.forEach(cityId => {
        //   promises.push(CitiesService.getCityById(cityId))
        // })

        // return Promise.all(promises)
        //   .then(responses => {
        //     const citiesInfo = responses.map(r => r.data)
        //     commit('setPreferredCities', citiesInfo)
        //   })
        //   .catch(error => {
        //     throw error
        //   })
        let allFulfilled = false
        let tries = 2

        while (tries > 0 && !allFulfilled) {
          citiesIds.forEach(cityId => {
            promises.push(CitiesService.getCityById(cityId))
          })
          const results = await Promise.allSettled(promises)
          const fulfilled = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value.data)
          commit('setPreferredCities', fulfilled)

          citiesIds = results
            .filter(result => result.status === 'rejected')
            .map(r =>
              r.reason.config.url.substring(
                r.reason.config.url.lastIndexOf('/') + 1
              )
            )

          allFulfilled = citiesIds.length === 0
          promises = []
          tries--
        }
        if (!allFulfilled) {
          Promise.reject('Could not load all favorites cities info')
        }
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
  }

  // getPreferencesCitiesInfo({ commit }) {
  //   return CitiesService.getPreferencesCitiesInfo()
  //     .then(response => {
  //       commit('setPreferences', response.data)
  //       return response.data
  //     })
  //     .catch(error => {
  //       throw error
  //     })
  // },
}

export default actions
