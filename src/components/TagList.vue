<template>
  <section class="tag-list">
    <el-tag
      v-for="item in items"
      :key="item[itemKey]"
      :disable-transitions="false"
      class="tag"
    >
      {{ item.name }}
      <el-popconfirm
        v-show="closable"
        :confirmButtonText="$t('yes')"
        :cancelButtonText="$t('no')"
        icon="el-icon-delete"
        iconColor="red"
        placement="top"
        :title="$t('confirm')"
        @onConfirm="removeItem(item)"
      >
        <el-button
          slot="reference"
          icon="el-icon-close"
          type="text"
          size="mini"
          round
        />
      </el-popconfirm>
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
  },
  i18n: {
    messages: {
      es: {
        confirm: 'Está seguro de eliminar el item?',
        yes: 'Sí, eliminar!',
        no: 'No, gracias'
      },
      en: {
        confirm: 'Are you sure to delete this item?',
        yes: 'Yes, delete!',
        no: 'No, thanks'
      }
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
    .el-icon-close:hover {
      color: #fff;
      background-color: #409eff;
      border-radius: 50%;
    }
  }
}
</style>
