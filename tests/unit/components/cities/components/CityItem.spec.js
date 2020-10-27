import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import CityItem from '@/components/cities/components/CityItem.vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import store from '@/store'
import * as citiesService from '@/services/cities.service'

Vue.use(VueI18n)
Vue.use(ElementUI)

const i18n = new VueI18n({
  locale: 'en',
  silentTranslationWarn: true
})

jest.mock('@/services/cities.service', () => ({
  saveCities: jest.fn(() => Promise.resolve())
}))

describe('CityItem.vue', () => {
  it('should render the component', () => {
    const item = { name: 'City', country: 'Country' }
    const wrapper = shallowMount(CityItem, {
      i18n,
      store,
      propsData: {
        item: item
      }
    })
    expect(wrapper).toBeDefined()
  })

  it('should render the city info', () => {
    const item = {
      country: 'Argentina',
      geonameid: 3865086,
      name: 'Bahía Blanca',
      subcountry: 'Buenos Aires'
    }
    const wrapper = shallowMount(CityItem, {
      i18n,
      store,
      propsData: {
        item: item
      }
    })
    expect(wrapper.find('.name').exists()).toBe(true)
    expect(wrapper.find('.name').text()).toBe('Bahía Blanca')

    expect(wrapper.find('.country').exists()).toBe(true)
    expect(wrapper.find('.country').text()).toContain('Buenos Aires')
    expect(wrapper.find('.country').text()).toContain('Argentina')
  })

  it('should save cities on item click', async () => {
    const item = {
      country: 'Argentina',
      geonameid: 3865086,
      name: 'Bahía Blanca',
      subcountry: 'Buenos Aires'
    }
    const wrapper = shallowMount(CityItem, {
      i18n,
      store,
      propsData: {
        item: item
      }
    })

    const itemWrapper = wrapper.find('.city-item')
    await itemWrapper.trigger('click')

    await wrapper.vm.$nextTick()
    expect(citiesService.saveCities).toHaveBeenCalledWith({ 3865086: true })
    expect(wrapper.find('.el-icon-collection-tag')).toBeDefined()
  })
})
