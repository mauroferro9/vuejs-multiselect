<template>
  <section class="tag-list">
    <el-tag
      v-for="item in items"
      :key="item[itemKey]"
      :disable-transitions="false"
      :closable="closable"
      @close="removeItem(item)"
      class="tag"
    >
      {{ item.name }}
    </el-tag>
  </section>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    items: {
      type: Array,
      required: true
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    removeItem(item) {
      this.$emit('onRemove', item[this.itemKey])
    }
  }
}
</script>

<style lang="scss">
.tag-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;

  .tag {
    margin: 5px 0;
    &:not(:first-of-type) {
      margin-left: 10px;
    }
  }
}
</style>
