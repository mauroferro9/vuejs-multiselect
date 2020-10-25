<template>
  <section class="cities-wrapper">
    <div v-if="loading">Cargando...</div>
    <div v-else>
      <h1>Cities</h1>
      <!-- {{ cities.data }} -->
      {{ error }}
      <span v-if="preferences">
        {{ preferences.data }}
      </span>
      <button @click="save">Save city</button>
      <div style="max-height: 150px; overflow: auto;">
        <div v-for="article in articles" :key="article.geonameid">
          {{ article.name }} / {{ article.subcountry }} / {{ article.country }}
        </div>
        <!-- <div v-if="loading2">Loading...</div> -->
        <div v-if="articles.length" v-observe-visibility="handleScroll"></div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import { ObserveVisibility } from 'vue-observe-visibility'

Vue.directive('observe-visibility', ObserveVisibility)

export default {
  name: 'Cities',
  data() {
    return {
      loading: false,
      loading2: false,
      error: null,
      articles: [],
      offset: 0,
      limit: 3000
    }
  },
  computed: {
    ...mapGetters('cities', ['cities', 'preferences'])
  },
  methods: {
    ...mapActions('cities', [
      'getCities',
      'saveCities',
      'getPreferences',
      'getPreferencesCitiesInfo'
    ]),
    save() {
      this.saveCities({
        225284: true
      })
    },
    async fetch() {
      let articles = await axios.get(
        `http://localhost:3030/cities?offset=${this.offset}&limit=${this.limit}`
      )
      this.articles.push(...articles.data.data)
      this.lastPage = !articles.data.links.next
    },
    handleScroll(isVisible) {
      if (!isVisible || this.lastPage) return
      this.offset += this.limit
      this.fetch()
    }
  },
  async mounted() {
    // get preferences
    // for each cityId, get city info and show them in select
    // get lazy cities alphabetically (without selected)
    this.loading = true
    try {
      await this.getPreferences()
      this.fetch()
      console.warn('success!')
    } catch (error) {
      console.warn(error)
      this.error = error
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
.cities-wrapper {
}
</style>
