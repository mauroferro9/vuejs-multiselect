<template>
  <section>
    <div v-for="item in items" :key="item[itemKey]">
      <slot name="item" v-bind:item="item" />
    </div>

    <div v-show="items.length" v-observe-visibility="handleScroll"></div>
  </section>
</template>

<script>
import Vue from 'vue'
Vue.directive('observe-visibility', ObserveVisibility)
import { ObserveVisibility } from 'vue-observe-visibility'

export default {
  name: 'InfiniteScroll',
  props: {
    items: {
      type: Array,
      required: true
    },
    itemKey: {
      type: String,
      required: true
    }
  },
  methods: {
    handleScroll(isVisible) {
      // TODO: handle short list
      if (!isVisible || this.items.length <= 6) return
      this.$emit('refetch')
    }
  }
}
</script>
