import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import Cities from '@/components/cities/Cities.vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import store from '@/store'
import * as citiesService from '@/services/cities.service'
import('intersection-observer')

Vue.use(VueI18n)
Vue.use(ElementUI)

const i18n = new VueI18n({
  locale: 'en',
  silentTranslationWarn: true
})

jest.mock('@/services/cities.service', () => ({
  getPreferences: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  getCountries: jest.fn(() => Promise.resolve({ data: [] })),
  getCities: jest.fn(() => Promise.resolve({ data: [], links: {}, total: 0 }))
}))

describe('Cities.vue', () => {
  it('should render the component', () => {
    const wrapper = shallowMount(Cities, {
      i18n,
      store
    })
    expect(wrapper).toBeDefined()
  })

  it('should load all countries info', () => {
    citiesService.getCountries.mockImplementation(() =>
      Promise.resolve({ data: [] })
    )
    shallowMount(Cities, {
      i18n,
      store
    })
    expect(citiesService.getCountries).toHaveBeenCalled()
  })

  it('should load favorites cities', () => {
    citiesService.getPreferences.mockImplementation(() =>
      Promise.resolve({ data: [] })
    )
    shallowMount(Cities, {
      i18n,
      store
    })
    expect(citiesService.getPreferences).toHaveBeenCalled()
  })

  it('should load all cities', () => {
    citiesService.getCities.mockImplementation(() =>
      Promise.resolve({ data: [], links: {}, total: 0 })
    )
    shallowMount(Cities, {
      i18n,
      store
    })
    expect(citiesService.getCities).toHaveBeenCalled()
  })

  xit('should search results when text input', async () => {
    citiesService.getCities.mockImplementation(() => Promise.resolve())
    const wrapper = shallowMount(Cities, {
      i18n,
      store
    })
    wrapper.setData({ search: 'a' })
    await wrapper.vm.$nextTick()
    expect(citiesService.getCities).toHaveBeenCalledWith(
      {
        search: 'a',
        limit: 20,
        offset: 0
      },
      expect.any(Function)
    )
  })
})
