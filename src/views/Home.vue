<template>
  <div class="home">
    <i18n />
    <Cities />
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    Cities: () => import('@/components/cities/Cities.vue'),
    i18n: () => import('@/components/i18n')
  }
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-grow: 1;
  justify-content: center;
}
</style>
