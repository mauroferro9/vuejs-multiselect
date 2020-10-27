module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@/styles/theme.scss';
          @import '@/styles/variables.scss';
          @import "@/styles/media-queries.scss";
        `
      }
    }
  }
}
