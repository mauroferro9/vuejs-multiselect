<template>
  <div style="margin: 5px 0;">
    <div v-for="item in items" :key="item[itemKey]">
      <slot name="item" v-bind:item="item" />
    </div>

    <div v-if="items.length" v-observe-visibility="handleScroll"></div>
  </div>
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
    },
    offset: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      currentOffset: 0
    }
  },
  methods: {
    handleScroll(isVisible) {
      if (!isVisible) return
      this.currentOffset += this.limit
      // this.fetch()
      this.$emit('refetch', this.currentOffset)
    }
  },
  mounted() {
    this.currentOffset = this.offset
  }
}
</script>

<style lang="scss" scoped></style>
