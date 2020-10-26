<template>
  <section class="i18n">
    <el-radio-group v-model="locale" size="mini">
      <el-radio-button label="es">Español</el-radio-button>
      <el-radio-button label="en">English</el-radio-button>
    </el-radio-group>
  </section>
</template>

<script>
export default {
  name: 'i18n',
  data() {
    return {
      locale: this.$i18n.locale
    }
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val
    }
  }
}
</script>

<style lang="scss">
.i18n {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
