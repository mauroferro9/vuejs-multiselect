<template>
  <section class="city-item" :class="{ active: isPreferred }">
    <div class="city-item__info" @click="save">
      <h1 class="name">
        <text-highlight :queries="highlight">{{ item.name }}</text-highlight>
      </h1>
      <div class="country">
        <text-highlight :queries="highlight">
          {{ item.subcountry }},
        </text-highlight>
        <div class="country__flag" v-if="hasFlag">
          <el-avatar :size="13" :src="flag"></el-avatar>
        </div>
        <text-highlight :queries="highlight">
          {{ item.country }}
        </text-highlight>
      </div>
    </div>
    <el-button
      v-if="isPreferred"
      icon="el-icon-star-on"
      circle
      type="warning"
      plain
    />
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
    async save() {
      try {
        await this.saveCities({
          [this.item.geonameid]: !this.isPreferred
        })
      } catch (error) {
        console.warn(error)
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
  padding: 5px 30px;
  border-bottom: solid 1px #dcdfe6;

  &:hover,
  &.active {
    cursor: pointer;
    background-color: antiquewhite;

    .city-item__info {
      .name,
      .country {
        color: silver;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;

    .name {
      font-size: 1rem;
      margin-block-start: 2px;
      margin-block-end: 2px;
    }

    .country {
      display: flex;
      font-size: 0.8rem;
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
