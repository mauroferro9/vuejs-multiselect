import Vue from 'vue'
import Vuex from 'vuex'
import citiesStore from './cities/citiesStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cities: citiesStore
  },
  strict: process.env.NODE_ENV !== 'production'
})
