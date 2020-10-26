<template>
  <section class="message">
    <span>
      <i :class="icon" v-show="icon"></i>
      {{ text }}
    </span>
  </section>
</template>

<script>
export default {
  name: 'Message',
  props: {
    icon: String,
    text: String
  }
}
</script>

<style lang="scss">
.message {
  line-height: 60px;
}
</style>
