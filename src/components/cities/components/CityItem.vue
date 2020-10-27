<template>
  <section
    class="city-item"
    :class="{ active: isPreferred }"
    v-loading="loading"
    @click="update"
  >
    <div class="city-item__info">
      <h1 class="name">
        <text-highlight :queries="highlight" :class="{ highlight }">
          {{ item.name }}
        </text-highlight>
      </h1>
      <div class="country">
        <text-highlight :queries="highlight" :class="{ highlight }">
          {{ item.subcountry }},
        </text-highlight>
        <div class="country__flag" v-if="hasFlag">
          <el-avatar :size="13" :src="flag"></el-avatar>
        </div>
        <text-highlight :queries="highlight" :class="{ highlight }">
          {{ item.country }}
        </text-highlight>
      </div>
    </div>
    <i v-show="isPreferred" class="el-icon-collection-tag"></i>
    <div v-show="!isPreferred && isCapitalCity" class="recommended">
      <i class="el-icon-star-off"></i> {{ $t('recommended') }}
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CityItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    highlight: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false
    }
  },
  components: {
    TextHighlight: () => import('vue-text-highlight')
  },
  computed: {
    ...mapGetters('cities', [
      'preferredCities',
      'countries',
      'preferredCitiesIds',
      'capitalCities'
    ]),
    hasFlag() {
      return this.countries[this.item.country.toLowerCase()]
    },
    flag() {
      return this.countries[this.item.country.toLowerCase()].flag
    },
    isPreferred() {
      return this.preferredCitiesIds.includes(this.item.geonameid)
    },
    isCapitalCity() {
      return this.capitalCities.includes(this.item.name.toLowerCase())
    }
  },
  methods: {
    ...mapActions('cities', ['saveCities']),
    async update() {
      this.loading = true
      try {
        await this.saveCities({
          [this.item.geonameid]: !this.isPreferred
        })
      } catch (error) {
        this.$notify.error({
          message: `${this.$i18n.t('errorMessages.save')}: ${
            this.item.name
          }. ${this.$i18n.t('tryAgain')}`,
          position: 'bottom-right'
        })
      } finally {
        this.loading = false
      }
    }
  },
  i18n: {
    messages: {
      es: {
        tryAgain: 'Por favor, intente nuevamente.',
        errorMessages: {
          save: 'No se ha podido guardar la ciudad'
        },
        recommended: 'Recomendada'
      },
      en: {
        tryAgain: 'Please, try again.',
        errorMessages: {
          save: 'Could not save the city'
        },
        recommended: 'Recommended'
      }
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
  padding: 10px 30px;
  border-bottom: solid 1px $gray;

  &.active {
    cursor: pointer;
    background-color: $primary-color;

    &:hover {
      background-color: rgba($primary-color, 0.9);
    }

    .city-item__info {
      .name,
      .country {
        color: white;
      }
    }
    [class^='el-icon-'] {
      font-size: 20px;
      color: white;
    }
  }

  &:hover {
    cursor: pointer;

    &:not(.active) {
      .city-item__info {
        .name,
        .country {
          color: $primary-color;
        }
      }
    }
  }

  .highlight {
    .text__highlight {
      color: white;
      background: $secondary-color;
      font-weight: bold;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;

    .name {
      font-size: 1.1rem;
      margin-block-start: 4px;
      margin-block-end: 4px;
    }

    .country {
      display: flex;
      font-size: 0.9rem;
      color: $dark-gray;

      &__flag {
        margin: 0 5px;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }

  .recommended {
    color: $gold;
  }
}
</style>
