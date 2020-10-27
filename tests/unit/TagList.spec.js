import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import TagList from '@/components/TagList.vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'

Vue.use(VueI18n)
Vue.use(ElementUI)

const i18n = new VueI18n({
  locale: 'en',
  silentTranslationWarn: true
})

describe('TagList.vue', () => {
  it('should render the component', () => {
    const wrapper = shallowMount(TagList, {
      i18n,
      propsData: {
        items: [],
        itemKey: 'id',
        itemText: 'name'
      }
    })
    expect(wrapper).toBeDefined()
    expect(wrapper.findAll('.tag').length).toBe(0)
  })

  it('should receive and show the list of items', () => {
    const testItems = [{ name: 'Name', id: '1' }]
    const wrapper = shallowMount(TagList, {
      i18n,
      propsData: {
        items: testItems,
        itemKey: 'id',
        itemText: 'name'
      }
    })
    expect(wrapper.vm.items).toStrictEqual(testItems)
    expect(wrapper.findAll('.tag').length).toBe(testItems.length)
  })

  it('should execute the closable action', () => {
    const testItems = [{ name: 'Name', id: '1' }]
    const wrapper = shallowMount(TagList, {
      i18n,
      propsData: {
        items: testItems,
        itemKey: 'id',
        itemText: 'name',
        closable: true
      }
    })
    expect(wrapper.vm.items).toStrictEqual(testItems)
  })
})
