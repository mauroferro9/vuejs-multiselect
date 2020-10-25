<template>
  <section class="city-item">
    <div class="city-item__info">
      <h1 class="name">{{ item.name }}</h1>
      <div class="country">{{ item.subcountry }} - {{ item.country }}</div>
    </div>
    <el-button icon="el-icon-star-off" circle type="warning" plain />
  </section>
</template>

<script>
export default {
  name: 'CityItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.city-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  border-bottom: solid 1px #dcdfe6;

  &:hover {
    cursor: pointer;
    background-color: aquamarine;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .name {
      font-size: 1rem;
      margin-block-start: 5px;
      margin-block-end: 5px;
    }

    .country {
      font-size: 0.8rem;
      color: #56585a;
    }
  }
}
</style>
