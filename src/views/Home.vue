<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Find pokemon"
          variant="outlined"
          width="100%"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedRegion"
          :items="regions.map((region) => region.name)"
          label="Select Region"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedType"
          :items="types.map((type) => type.name)"
          label="Select Type"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-radio-group v-model="sortBy" row>
          <v-radio label="ID" value="id"></v-radio>
          <v-radio label="Name" value="name"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="pokemon in sortedFilteredPokemons"
        :key="pokemon.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          :style="{ background: getPokemonGradient(pokemon.types) }"
          @click="viewPokemon(pokemon.id)"
        >
          <v-card-subtitle>
            # {{ String(pokemon.id).padStart(2, "0") }}
          </v-card-subtitle>
          <v-img
            :src="pokemon.sprites.other.dream_world.front_default"
            class="white--text align-end"
            height="140px"
          ></v-img>
          <v-card-title>{{
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
          }}</v-card-title>
          <v-card-text>
            <div class="type-container">
              <span
                v-for="type in pokemon.types"
                :key="type.type.name"
                :class="[`type_bg ${type.type.name}`]"
              >
                <img
                  :src="`/pokeTypes/${type.type.name}.png`"
                  :alt="type.type.name"
                />
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-icon
      icon="mdi-arrow-up-bold-circle-outline"
      size="50"
      v-if="showScrollToTop"
      @click="scrollToTop"
      class="scroll_btn"
    ></v-icon>
  </v-container>
</template>

<script>
import axios from "axios";
import { colorTypeGradients } from "../utils";

export default {
  name: "Home",
  data() {
    return {
      search: "",
      pokemons: [],
      selectedRegion: null,
      selectedType: null,
      sortBy: "id",
      limit: 21,
      offset: 0,
      showScrollToTop: false,
      regions: [
        {
          name: "Kanto",
          limit: 150,
          offset: 0,
        },
        {
          name: "Johto",
          limit: 100,
          offset: 151,
        },
        {
          name: "Hoenn",
          limit: 135,
          offset: 251,
        },
        {
          name: "Sinnoh",
          limit: 108,
          offset: 386,
        },
        {
          name: "Unova",
          limit: 155,
          offset: 494,
        },
        {
          name: "Kalos",
          limit: 72,
          offset: 649,
        },
        {
          name: "Alola",
          limit: 88,
          offset: 721,
        },
        {
          name: "Galar",
          limit: 89,
          offset: 809,
        },
      ],
      types: [
        { name: "all types" },
        { name: "grass" },
        { name: "bug" },
        { name: "dark" },
        { name: "dragon" },
        { name: "electric" },
        { name: "fairy" },
        { name: "fighting" },
        { name: "fire" },
        { name: "flying" },
        { name: "ghost" },
        { name: "ground" },
        { name: "ice" },
        { name: "normal" },
        { name: "poison" },
        { name: "psychic" },
        { name: "rock" },
        { name: "steel" },
        { name: "water" },
      ],
    };
  },
  computed: {
    sortedFilteredPokemons() {
      let filteredPokemons = this.pokemons;

      if (this.search) {
        filteredPokemons = filteredPokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }

      if (this.selectedType && this.selectedType !== "all types") {
        filteredPokemons = filteredPokemons.filter((pokemon) =>
          pokemon.types.some((type) => type.type.name === this.selectedType)
        );
      }

      filteredPokemons.sort((a, b) => {
        if (this.sortBy === "id") {
          return a.id - b.id;
        } else if (this.sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
      });

      return filteredPokemons;
    },
  },
  methods: {
    async fetchPokemons(limit, offset) {
      try {
        const promises = [];
        for (let i = offset + 1; i <= offset + limit; i++) {
          promises.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
        }
        const responses = await Promise.all(promises);
        this.pokemons = [
          ...this.pokemons,
          ...responses.map((response) => response.data),
        ];
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      }
    },
    viewPokemon(id) {
      this.$router.push({ path: `/pokemon/${id}` });
    },
    getPokemonGradient(types) {
      const typeNames = types.map((type) => type.type.name);
      return `linear-gradient(${colorTypeGradients(
        typeNames[0],
        typeNames[1],
        typeNames.length
      ).join(", ")})`;
    },
    handleScroll() {
      const bottomOfWindow =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 10;
      if (bottomOfWindow && !this.selectedRegion) {
        this.offset += this.limit;
        this.fetchPokemons(this.limit, this.offset);
      }
      this.showScrollToTop = window.scrollY > 200;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    fetchRegionPokemons() {
      const region = this.regions.find((r) => r.name === this.selectedRegion);
      if (region) {
        this.limit = region.limit;
        this.offset = region.offset;
        this.pokemons = [];
        this.fetchPokemons(this.limit, this.offset);
      }
    },
  },
  watch: {
    selectedRegion() {
      this.fetchRegionPokemons();
    },
  },
  async created() {
    this.fetchPokemons(this.limit, this.offset);
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.v-text-field,
.v-select,
.v-radio{
  color: var(--filters);
  font-family: 'Press Start 2P', cursive;
}

.v-icon{
  color: var(--filters);
}
</style>