<template>
  <section
    class="city-item"
    :class="{ active: isPreferred }"
    v-loading="loading"
  >
    <div class="city-item__info" @click="update">
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
    <!-- 
    <el-button
      v-if="isPreferred"
      icon="el-icon-star-on"
      circle
      type="warning"
      plain
    /> -->
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
      type: Array
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
    ...mapGetters('cities', ['preferredCities', 'countries']),
    hasFlag() {
      return this.countries[this.item.country.toLowerCase()]
    },
    flag() {
      return this.countries[this.item.country.toLowerCase()].flag
    },
    isPreferred() {
      return (
        this.preferredCities.data.findIndex(
          city => city.geonameid === this.item.geonameid
        ) !== -1
      )
    }
  },
  methods: {
    ...mapActions('cities', ['saveCities']),
    async update() {
      // this.$emit('onUpdate', {
      //   [this.item.geonameid]: !this.isPreferred
      // })
      this.loading = true
      try {
        await this.saveCities({
          [this.item.geonameid]: !this.isPreferred
        })
      } catch (error) {
        this.$notify.error({
          message: `${this.$i18n.t('errorMessages.save')}:  ${
            this.item.name
          }. ${this.$i18n.t('tryAgain')}`,
          duration: 0,
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
        }
      },
      en: {
        tryAgain: 'Please, try again.',
        errorMessages: {
          save: 'Could not save the city'
        }
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
  border-bottom: solid 1px #dcdfe6;

  &.active {
    cursor: pointer;
    background-color: $primary-color;

    &:hover {
      background-color: rgba($primary-color, 0.9); // rgba(255, 117, 109, 0.9);
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
      color: #56585a;

      &__flag {
        margin: 0 5px;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
}
</style>
