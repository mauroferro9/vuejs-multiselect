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
  background: linear-gradient(
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.9)
    ),
    url(./assets/images/background.jpg) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

  font-family: $font-family;

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
  .el-button--text:hover,
  .el-loading-spinner .el-loading-text {
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
  padding: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
