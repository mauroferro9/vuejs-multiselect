<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss">
html {
  font-family: Avenir, Helvetica, Arial, sans-serif;

  .el-loading-spinner .path {
    stroke: $secondary-color;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner,
  .el-button--primary,
  .el-button--primary:hover {
    background-color: $secondary-color;
    border-color: $secondary-color;
  }
  .el-radio-button__inner:hover,
  .el-button--text,
  .el-button--text:hover {
    color: $secondary-color;
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: $secondary-color;
  }
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
