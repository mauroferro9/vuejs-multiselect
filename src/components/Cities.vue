<template>
  <section class="cities">
    <!-- <input type="radio" value="en" name="en" v-model="locale" />
    <label for="en">English</label><br />

    <input type="radio" value="es" name="es" v-model="locale" />
    <label for="es">Español</label><br /> -->
    <el-radio-group v-model="locale">
      <el-radio-button label="es">Español</el-radio-button>
      <el-radio-button label="en">English</el-radio-button>
    </el-radio-group>

    <div class="cities-body">
      <h1 v-if="preferredCities.data.length">
        {{ $t('titleFavorite') }} ({{ preferredCities.data.length }})
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
        :placeholder="$t('search.placeholder')"
        clearable
        @input="filterCities"
        class="cities-body__search"
      />

      <div class="cities-body__list">
        <InfiniteScroll
          :items="items"
          item-key="geonameid"
          @refetch="fetchCities"
        >
          <template v-slot:item="{ item }">
            <CityItem :item="item" :highlight="highlightText" />
            <!-- @onUpdate="updateCity" -->
          </template>
        </InfiniteScroll>
        <Message
          icon="el-icon-loading"
          class="loading-wrapper"
          v-if="loading && !retries"
        />
        <!-- <span v-if="loading && !retries" class="loading-wrapper">
          <i class="el-icon-loading"></i>
        </span> -->
        <Message
          icon="el-icon-warning-outline"
          :text="$t('noResults')"
          v-if="!loading && !retries && !items.length"
        />
        <!-- <span v-if="!loading && !retries && !items.length">
          <i class="el-icon-warning-outline"></i>
          No se encontraron resultados.
        </span> -->
      </div>
      <Message :text="$t('errorMessages.more')" v-if="!loading && retries" />
      <!-- <span v-if="retries" class="loading-wrapper">
        <i class="el-icon-loading"></i>
        <span>Oops! An error has ocurred while getting more cities.</span><br />
        <span>Let's try one more time!</span>
      </span> -->
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash.debounce'
import CityItem from './CityItem'

const DEBOUNCE_TIME = 300

export default {
  name: 'Cities',
  data() {
    return {
      locale: this.$i18n.locale,
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
      },
      currentOffset: 0
    }
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val
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
    InfiniteScroll: () => import('./InfiniteScroll.vue'),
    Message: () => import('./Message.vue')
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
        this.$notify.error({
          message: `${this.$i18n.t(
            'errorMessages.fav'
          )}: "${error}". ${this.$i18n.t('tryAgain')}`,
          position: 'bottom-right'
        })
      } finally {
        this.loading = false
      }
    },
    fetchCities() {
      if (!this.loading) {
        this.currentOffset += this.limit
        this.search
          ? this.fetchSearchCities(this.currentOffset, true)
          : this.fetchAllCities(this.currentOffset)
      }
    },
    filterCities: debounce(function() {
      this.search ? this.fetchSearchCities(0, true) : this.fetchAllCities(0)
    }, DEBOUNCE_TIME),
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
          // TODO: allow mannualy retry
          this.$notify.error({
            message: `${this.$i18n.t(
              'errorMessages.fav'
            )}: "${error}". ${this.$i18n.t('tryAgain')}`,
            position: 'bottom-right'
          })
        }
      } finally {
        this.loading = false
      }
    },
    async fetchSearchCities(offset, newSearch = false) {
      if (this.filteredCities.lastPage && !newSearch) return

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
        if (error.message === 'cancelled') return
        this.retries++
        if (this.retries <= 2) {
          this.filteredCities.offset = offset
          setTimeout(() => {
            this.fetchSearchCities(this.filteredCities.offset)
          }, 300)
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
        this.$notify.error({
          message: `${this.$i18n.t(
            'errorMessages.delete'
          )}: "${error}". ${this.$i18n.t('tryAgain')}`,
          position: 'bottom-right'
        })
      }
    }
  },
  async mounted() {
    await this.fetchPreferences()
    this.getCountries()
    await this.fetchAllCities(this.allCities.offset)
  },
  i18n: {
    messages: {
      es: {
        titleFavorite: 'Mis ciudades favoritas',
        search: {
          placeholder: 'Seleccione o busque sus ciudades favoritas'
        },
        noResults: 'No se encontraron resultados',
        tryAgain: 'Por favor, intente nuevamente.',
        errorMessages: {
          more: `Ups! Ha ocurrido un error al recuperar más ciudades. Intentemos nuevamente!`,
          fav: 'No se pudieron obtenes sus ciudades favoritas',
          delete: 'No se pudo eliminar la ciudad favorita'
        }
      },
      en: {
        titleFavorite: 'My favorite cities',
        search: {
          placeholder: 'Select or search your favorite cities'
        },
        noResults: 'No results found',
        tryAgain: 'Please, try again.',
        errorMessages: {
          more: `Oops! An error has ocurred while getting more cities. Let's try one more time!`,
          fav: 'Could not get your favorite cities',
          delete: 'Could not delete favorite city'
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
      min-height: 60px;
      max-height: 50vh;
      overflow: auto;
      border: solid 1px #dcdfe6;
      border-top: none;
      border-radius: 0 0 4px 4px;
    }
    .loading-wrapper {
      min-height: 40px;

      [class^='el-icon-'] {
        font-size: 30px;
        color: #0471a6;
      }
    }
  }
}
</style>
