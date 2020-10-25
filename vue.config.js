module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@/style/variables.scss';
          @import "@/style/media-queries.scss";
        `
      }
    }
  }
}
