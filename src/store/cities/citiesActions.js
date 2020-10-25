import CitiesService from '@/services/cities.service'

const actions = {
  getCities({ commit }, payload) {
    return CitiesService.getCities(payload).then(response => {
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
      .then(response => {
        commit('setPreferences', response.data)
        let promises = []
        const citiesIds = response.data && response.data.data

        citiesIds.forEach(cityId => {
          promises.push(CitiesService.getCityById(cityId))
        })

        return Promise.all(promises)
          .then(responses => {
            const citiesInfo = responses.map(r => r.data)
            commit('setPreferredCities', citiesInfo)
          })
          .catch(error => {
            throw error
          })
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
