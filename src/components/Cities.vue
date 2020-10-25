<template>
  <section class="cities">
    <div class="cities-body">
      <h1 v-if="preferredCities.data.length">
        My favorite cities ({{ preferredCities.data.length }})
      </h1>

      <TagList
        v-if="preferredCities.data"
        :items="preferredCities.data"
        item-key="geonameid"
        :closable="true"
        @onRemove="removeCity"
      />

      <el-input
        v-model="search"
        prefix-icon="el-icon-search"
        placeholder="Please select your fav cities"
        clearable
        @input="filterCities"
        class="cities-body__search"
      />

      <div class="cities-body__list">
        <InfiniteScroll
          :items="items"
          item-key="geonameid"
          :offset="offset"
          :limit="limit"
          @refetch="fetchCities"
        >
          <template v-slot:item="{ item }">
            <CityItem :item="item" :highlight="highlightText" />
          </template>
        </InfiniteScroll>
        <span v-if="loading && !retries" class="loading-wrapper">
          <i class="el-icon-loading primary"></i> Loading
        </span>
      </div>
      <span v-if="retries">Retry #{{ retries }}/2</span>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash.debounce'
import CityItem from './CityItem'

export default {
  name: 'Cities',
  data() {
    return {
      search: '',
      allCities: {
        offset: 0,
        limit: 20,
        lastPage: false
      },
      retries: 0,
      loading: false,
      filteredCities: {
        offset: 0,
        limit: 20,
        lastPage: false
      }
    }
  },
  computed: {
    ...mapGetters('cities', [
      'cities',
      'preferences',
      'searchCities',
      'preferredCities'
    ]),
    items() {
      return this.search ? this.searchCities.data : this.cities.data
    },
    offset() {
      return this.search ? this.filteredCities.offset : this.allCities.offset
    },
    limit() {
      return this.search ? this.filteredCities.limit : this.allCities.limit
    },
    highlightText() {
      return this.search.split(' ')
    }
  },
  components: {
    CityItem,
    TagList: () => import('./TagList.vue'),
    InfiniteScroll: () => import('./InfiniteScroll.vue')
  },
  methods: {
    ...mapActions('cities', [
      'getCities',
      'saveCities',
      'getPreferences',
      'getCountries'
    ]),
    async fetchPreferences() {
      this.loading = true
      try {
        await this.getPreferences()
      } catch (error) {
        console.warn(error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
    fetchCities(offset) {
      this.search
        ? this.fetchSearchCities(offset, true)
        : this.fetchAllCities(offset)
    },
    async fetchAllCities(offset) {
      if (this.allCities.lastPage) return

      try {
        this.loading = true
        await this.getCities({
          offset,
          limit: this.allCities.limit
        })
        this.retries = 0
        this.allCities.lastPage =
          offset + this.allCities.limit >= this.cities.total
      } catch (error) {
        this.retries++
        if (this.retries <= 2) {
          this.allCities.offset = offset
          setTimeout(() => {
            this.fetchAllCities(this.allCities.offset)
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
      }
    },
    async fetchSearchCities(offset, newSearch = false) {
      if (this.filteredCities.lastPage) return

      try {
        this.loading = true
        await this.getCities({
          offset,
          limit: this.filteredCities.limit,
          filter: this.search,
          newSearch
        })
        this.retries = 0
        this.filteredCities.lastPage =
          offset + this.filteredCities.limit >= this.searchCities.total
      } catch (error) {
        this.retries++
        if (this.retries <= 2) {
          this.filteredCities.offset = offset
          setTimeout(() => {
            this.fetchSearchCities(this.filteredCities.offset)
          }, 1000)
        }
      } finally {
        this.loading = false
      }
    },
    async removeCity(cityId) {
      try {
        await this.saveCities({
          [cityId]: false
        })
      } catch (error) {
        console.warn(error)
      }
    },
    filterCities: debounce(function() {
      this.fetchSearchCities(0, true)
    }, 300)
  },
  async mounted() {
    await this.fetchPreferences()
    this.getCountries()
    await this.fetchAllCities(this.allCities.offset)
  }
}
</script>

<style lang="scss">
.cities {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px;

  .cities-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    @include sm {
      flex-basis: 50%;
    }

    &__search {
      .el-input__inner {
        border-radius: 4px 4px 0 0;
      }
    }

    &__list {
      margin-top: 0;
      max-height: 50vh;
      overflow: auto;
      border: solid 1px #dcdfe6;
      border-top: none;
      border-radius: 0 0 4px 4px;

      .loading-wrapper {
        min-height: 40px;
      }
    }
  }
}
</style>
