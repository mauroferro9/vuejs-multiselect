<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <Cities />
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    Cities: () => import('@/components/Cities.vue')
  }
}
</script>
