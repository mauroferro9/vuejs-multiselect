import CitiesService from '@/services/cities.service'

const actions = {
  getCities({ commit }, payload) {
    return CitiesService.getCities(payload).then(response => {
      commit('setCities', response.data)
      return response.data
    })
  },
  saveCities(context, cities) {
    return CitiesService.saveCities(cities).then(response => {
      // commit('setCities', response.data)
      return response.data
    })
  },
  getPreferences({ commit }) {
    return CitiesService.getPreferences()
      .then(response => {
        commit('setPreferences', response.data)
        const promises = []
        const citiesIds = response.data && response.data.data

        citiesIds.forEach(cityId => {
          promises.push(CitiesService.getCityById(cityId))
        })

        return Promise.all(promises)
          .then(responses => {
            const citiesInfo = responses.map(r => r.data)
            console.warn(citiesInfo)
            commit('setCities', citiesInfo)
          })
          .catch(error => {
            throw error
          })
      })
      .catch(error => {
        throw error
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
