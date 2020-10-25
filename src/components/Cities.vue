<template>
  <section class="cities">
    <h1>Cities</h1>
    <div class="cities-body">
      <!-- {{ cities.data }} -->
      <!-- {{ error }} -->
      <!-- <button @click="save">Save city</button> -->
      <!-- <span v-if="preferences">
        {{ preferences.data }}
      </span> -->

      <el-input
        v-model="input"
        prefix-icon="el-icon-search"
        placeholder="Please select your fav cities"
        clearable
      />

      <div class="cities-body__list">
        <InfiniteScroll
          :items="cities.data"
          itemKey="geonameid"
          :offset="offset"
          :limit="limit"
          @refetch="fetchCities"
        >
          <template v-slot:item="{ item }">
            <CityItem :item="item" />
          </template>
        </InfiniteScroll>
        <span v-if="loading && !retries">Loading...</span>
      </div>
      <span v-if="retries">Retry {{ retries }}</span>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CityItem from './CityItem'

export default {
  name: 'Cities',
  data() {
    return {
      input: '',
      offset: 0,
      limit: 20,
      lastPage: false,
      retries: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters('cities', ['cities', 'preferences'])
  },
  components: {
    CityItem,
    InfiniteScroll: () => import('./InfiniteScroll.vue')
  },
  methods: {
    ...mapActions('cities', ['getCities', 'saveCities', 'getPreferences']),
    async initPreferences() {
      this.loading = true
      try {
        await this.getPreferences()
        console.warn('success!')
      } catch (error) {
        console.warn(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async fetchCities(offset) {
      if (this.lastPage) return

      try {
        this.loading = true
        // this.loading = this.$loading({
        //   lock: false,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   fullscreen: false
        // })
        // this.loading = this.$loading({
        //   lock: false,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading'
        // })
        await this.getCities({
          offset,
          limit: this.limit
        })
        this.retries = 0
        this.lastPage = offset + this.limit >= this.cities.total
      } catch (error) {
        this.retries++
        if (this.retries <= 2) {
          this.offset = offset
          setTimeout(() => {
            this.fetchCities(this.offset)
          }, 1000)
        } else {
          // TODO: show retry mannualy or error message
          // this.$notify.error({
          //   title: 'Custom Position',
          //   message: error.data.message,
          //   position: 'bottom-right'
          // })
        }
      } finally {
        this.loading = false
        // this.$nextTick(() => {
        //   this.loading.close()
        // })
      }
    }
  },
  async mounted() {
    // await this.initPreferences()
    await this.fetchCities(this.offset)
  }
}
</script>

<style lang="scss">
.cities {
  @include md {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    max-width: 50%;
  }

  .cities-body {
    &__list {
      max-height: 50vh;
      overflow: auto;
      border-bottom: solid 1px #dcdfe6;
    }
  }
}
</style>
