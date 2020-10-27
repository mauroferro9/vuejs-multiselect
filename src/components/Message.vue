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
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 60px;
}
</style>
