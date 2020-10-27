<template>
  <section class="cities">
    <!-- favorites list -->
    <div
      v-loading="loadingFav"
      :element-loading-text="$t('loading.fav')"
      class="head-wrapper"
    >
      <!-- header -->
      <h1 class="title">
        <span v-if="preferredCities.data.length">
          <i class="el-icon-collection-tag"></i>
          {{ $t('titleFavorite') }} ({{ preferredCities.data.length }})
        </span>
        <span v-else-if="!loadingFav && !showReloadFav">
          <i class="el-icon-info"></i> {{ $t('noFavs') }}
        </span>
        <el-button
          v-if="showReloadFav"
          type="primary"
          icon="el-icon-refresh"
          @click="fetchPreferences"
        >
          {{ $t('reloadFav') }}
        </el-button>
      </h1>

      <!-- tags -->
      <div class="cities-header">
        <TagList
          v-if="preferredCities.data"
          :items="preferredCities.data"
          item-key="geonameid"
          item-text="name"
          :closable="true"
          @onRemove="removeCity"
        />
      </div>
    </div>

    <!-- results counter -->
    <span v-show="!loading" class="results">
      <i class="el-icon-location-outline"></i> {{ resultsCounter }}
      {{ $t('resultsFound') }}
      <span v-show="search">
        for <strong>“{{ search }}”</strong>
      </span>
    </span>

    <div class="body-wrapper">
      <div class="cities-body">
        <!-- search input -->
        <el-input
          v-model="search"
          prefix-icon="el-icon-search"
          :placeholder="$t('search.placeholder')"
          clearable
          @input="searchCitiesByText"
          class="cities-body__search"
        />

        <!-- search results -->
        <div
          class="cities-body__list"
          v-loading="loading"
          :element-loading-text="$t('loading.cities')"
        >
          <InfiniteScroll
            :items="items"
            item-key="geonameid"
            @refetch="loadMore"
          >
            <template v-slot:item="{ item }">
              <CityItem :item="item" :highlight="highlightText" />
            </template>
          </InfiniteScroll>
          <div
            v-loading="loading && !retries && items.length"
            class="spinner"
          ></div>

          <Message
            icon="el-icon-warning-outline"
            :text="$t('noResults')"
            v-if="!loading && !retries && !items.length"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import debounce from 'lodash.debounce'
import CityItem from './components/CityItem'

const DEBOUNCE_TIME = 300
const TIMEOUT_TIME = 1000
const LIMIT = 20

export default {
  name: 'Cities',
  data() {
    return {
      search: '',
      retries: 0,
      loading: false,
      loadingFav: false,
      currentOffset: 0,
      showReloadFav: false,
      lastPage: false
    }
  },

  computed: {
    ...mapGetters('cities', [
      'preferences',
      'preferredCities',
      'cities',
      'searchCities',
      'preferredCitiesIds'
    ]),
    items() {
      return this.search ? this.searchCities.data : this.cities.data
    },
    highlightText() {
      return this.search.split(' ')
    },
    resultsCounter() {
      return this.search ? this.searchCities.total : this.cities.total
    }
  },
  components: {
    CityItem,
    TagList: () => import('../TagList.vue'),
    InfiniteScroll: () => import('../InfiniteScroll.vue'),
    Message: () => import('../Message.vue')
  },
  methods: {
    ...mapActions('cities', [
      'getCities',
      'saveCities',
      'getPreferences',
      'getCountries'
    ]),
    ...mapMutations('cities', ['cleanCities']),
    async fetchPreferences() {
      this.showReloadFav = false
      this.loadingFav = true
      try {
        await this.getPreferences()
      } catch (error) {
        this.showReloadFav = true
        this.$notify.error({
          message: `${this.$i18n.t('errorMessages.fav')}: "${
            error.data.message
          }". ${this.$i18n.t('tryAgain')}`,
          position: 'bottom-right'
        })
      } finally {
        this.loadingFav = false
      }
    },
    loadMore() {
      if (!this.loading && !this.lastPage) {
        this.currentOffset += LIMIT
        this.search
          ? this.fetchSearchCities(this.currentOffset, true)
          : this.fetchAllCities(this.currentOffset)
      }
    },
    searchCitiesByText: debounce(function() {
      this.cleanCities()
      this.lastPage = false
      this.currentOffset = 0
      this.search
        ? this.fetchSearchCities(this.currentOffset, true)
        : this.fetchAllCities(this.currentOffset)
    }, DEBOUNCE_TIME),
    async fetchAllCities(offset) {
      if (this.lastPage) return

      try {
        this.loading = true
        await this.getCities({
          offset,
          limit: LIMIT
        })
        this.retries = 0
        this.lastPage = offset + LIMIT >= this.cities.total
      } catch (error) {
        this.retries++
        if (this.retries <= 2) {
          setTimeout(() => {
            this.fetchAllCities(offset)
          }, TIMEOUT_TIME)

          this.$notify.warning({
            message: this.$i18n.t('errorMessages.more'),
            position: 'bottom-right'
          })
        } else {
          this.$notify.error({
            message: `${this.$i18n.t('errorMessages.fav')}: "${
              error.message
            }". ${this.$i18n.t('tryAgain')}`,
            position: 'bottom-right'
          })
        }
      } finally {
        this.loading = false
      }
    },
    async fetchSearchCities(offset, newSearch = false) {
      if (this.lastPage && !newSearch) return

      try {
        this.loading = true
        await this.getCities({
          offset,
          limit: LIMIT,
          filter: this.search,
          newSearch
        })
        this.retries = 0
        this.lastPage = offset + LIMIT >= this.searchCities.total
      } catch (error) {
        if (error === 'cancelled') return
        this.retries++
        if (this.retries <= 2) {
          setTimeout(() => {
            this.fetchSearchCities(offset)
          }, TIMEOUT_TIME)
        }
      } finally {
        this.loading = false
      }
    },
    async removeCity(cityId) {
      try {
        this.loadingFav = true
        await this.saveCities({
          [cityId]: false
        })
      } catch (error) {
        this.$notify.error({
          message: `${this.$i18n.t('errorMessages.delete')}: "${
            error.message
          }". ${this.$i18n.t('tryAgain')}`,
          position: 'bottom-right'
        })
      } finally {
        this.loadingFav = false
      }
    }
  },
  mounted() {
    this.fetchPreferences()
    this.getCountries()
    this.fetchAllCities(0)
  },
  i18n: {
    messages: {
      es: {
        titleFavorite: 'Mis ciudades favoritas',
        search: {
          placeholder: 'Buscar por nombre de ciudad, región o país'
        },
        noResults: 'No se encontraron resultados',
        tryAgain: 'Por favor, intente nuevamente.',
        noFavs: 'Aún no tiene ciudades favoritas',
        reloadFav: 'Recargar favoritos',
        resultsFound: 'resultados encontrados',
        errorMessages: {
          more: `Ups! Ha ocurrido un error al recuperar más ciudades. Intentemos nuevamente!`,
          fav: 'No se pudieron obtenes sus ciudades favoritas',
          delete: 'No se pudo eliminar la ciudad favorita'
        },
        loading: {
          cities: 'Cargando ciudades',
          fav: 'Cargando favoritos'
        }
      },
      en: {
        titleFavorite: 'My favorite cities',
        search: {
          placeholder: 'Search by city name, region or country'
        },
        noResults: 'No results found',
        noFavs: `You don't have favorite cities yet`,
        tryAgain: 'Please, try again.',
        reloadFav: 'Reload favorites',
        resultsFound: 'results found',
        errorMessages: {
          more: `Oops! An error has ocurred while getting more cities. Let's try one more time!`,
          fav: 'Could not get your favorite cities',
          delete: 'Could not delete favorite city'
        },
        loading: {
          cities: 'Loading cities',
          fav: 'Loading favorites'
        }
      }
    }
  }
}
</script>

<style lang="scss">
.cities {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 80vh;
  padding: 20px;

  .head-wrapper {
    .el-loading-mask {
      background-color: transparent;
    }
  }

  .cities-header {
    margin-bottom: 20px;
    overflow: auto;
    height: 20vh;
  }
  .title {
    font-size: 1.2rem;
  }

  .body-wrapper {
    display: flex;
    justify-content: center;

    .cities-body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      border-radius: 4px;
      justify-content: flex-start;

      &:hover {
        box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
      }

      @include sm {
        max-width: 80%;
      }

      @include lg {
        max-width: 70%;
      }

      @include lg {
        max-width: 60%;
      }

      &__search {
        .el-input__inner {
          font-size: 1rem;
          border-radius: 4px 4px 0 0;
          height: 50px;
          line-height: 50px;
        }
      }

      &__list {
        margin-top: 0;
        height: 50vh;
        overflow: auto;
        border: solid 1px #dcdfe6;
        border-top: none;
        border-radius: 0 0 4px 4px;
        background: white;
        .spinner {
          min-height: 50px;
        }
      }
    }
  }
}
</style>
