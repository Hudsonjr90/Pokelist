<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Find pokémon"
          variant="outlined"
          width="100%"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedRegion"
          :items="regions.map((region) => region.name)"
          class="select_font"
          label="Region"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedType"
          :items="types.map((type) => type.name)"
          class="select_font"
          label="Type"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-radio-group v-model="sortBy" row>
          <v-radio label="ID" value="id"></v-radio>
          <v-radio label="Name" value="name"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row justify="start">
      <h1>List</h1>
    </v-row>
    <v-row v-if="!selectedRegion" justify="center" class="info_container">
      <v-col cols="12" align="center">
        <v-alert type="info">Please select a region</v-alert>
      </v-col>
    </v-row>
    <v-row v-if="isLoadingPokemon" justify="center">
      <v-col cols="12" align="center">
        <img
          src="../assets/images/pokeball.gif"
          class="loading-gif noselect"
          alt="loading-gif"
          width="50%"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="
        sortedFilteredPokemons.length === 0 &&
        !isLoadingPokemon &&
        selectedRegion
      "
      justify="center"
      class="info_container"
    >
      <v-col cols="12" align="center">
        <v-alert type="info">There are no pokemon in this region</v-alert>
        <img
          src="../assets/images/pokeball.png"
          class="loading-gif noselect"
          alt="loading-gif"
          width="30%"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="pokemon in paginatedPokemons"
        :key="pokemon.id + '-' + pokemon.name"
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
                v-tooltip:bottom="type.type.name"
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
    <v-pagination
      v-model="currentPage"
      :length="pageCount"
      @input="changePage"
      class="mt-4"
    ></v-pagination>
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

const pokemonCache = {};

export default {
  name: "Home",
  data() {
    return {
      search: "",
      pokemons: [],
      selectedRegion: null,
      selectedType: "all types",
      sortBy: "id",
      limit: 151,
      offset: 0,
      showScrollToTop: false,
      isLoading: false,
      isLoadingPokemon: false,
      currentPage: 1,
      perPage: 21,
      regions: [
        {
          name: "Kanto",
          limit: 151,
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
    paginatedPokemons() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.sortedFilteredPokemons.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.sortedFilteredPokemons.length / this.perPage);
    },
  },
  methods: {
    async fetchPokemons(limit, offset) {
      try {
        const promises = [];
        for (let i = offset + 1; i <= offset + limit; i++) {
          if (pokemonCache[i]) {
            promises.push(Promise.resolve(pokemonCache[i]));
          } else {
            promises.push(
              axios
                .get(`https://pokeapi.co/api/v2/pokemon/${i}`)
                .then((response) => {
                  pokemonCache[i] = response.data;
                  return response.data;
                })
            );
          }
        }
        const responses = await Promise.all(promises);
        this.pokemons = responses;
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      }
    },
    viewPokemon(id) {
      const currentPage = this.currentPage;
      if (this.sortedFilteredPokemons.length === 0) {
        this.isLoadingPokemon = true;
      }
      localStorage.setItem("currentPage", currentPage);
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

      if (
        bottomOfWindow &&
        !this.isLoading &&
        this.pokemons.length <
          this.regions.find((region) => region.name === this.selectedRegion)
            .limit
      ) {
        this.isLoading = true;
        this.offset += this.limit;
        this.fetchPokemons(this.limit, this.offset);
        this.isLoading = false;
      }

      this.showScrollToTop = window.scrollY > 200;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    changePage(page) {
      this.currentPage = page;
    },
    async fetchRegionPokemons() {
      const region = this.regions.find((r) => r.name === this.selectedRegion);
      if (region) {
        this.limit = region.limit;
        this.offset = region.offset;
        this.pokemons = [];
        this.isLoadingPokemon = true;
        await this.fetchPokemons(this.limit, this.offset);
        this.isLoadingPokemon = false;
      }
    },
    saveSelections() {
      localStorage.setItem("selectedRegion", this.selectedRegion);
      localStorage.setItem("selectedType", this.selectedType);
    },
    loadSelections() {
      const region = localStorage.getItem("selectedRegion");
      const type = localStorage.getItem("selectedType");
      if (region) this.selectedRegion = region;
      if (type) this.selectedType = type;
    },
  },
  watch: {
    selectedRegion() {
      this.saveSelections();
      this.fetchRegionPokemons();
      this.currentPage = 1;
    },
    selectedType() {
      this.saveSelections();
      this.currentPage = 1;
    },
    currentPage() {
      this.scrollToTop();
    },
  },
  async created() {
    this.loadSelections();
    await this.fetchRegionPokemons();
    this.currentPage = Number(localStorage.getItem("currentPage")) || 1;
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.v-text-field,
.v-radio,
.select_font,
.v-pagination,
h1 {
  color: var(--filters);
  font-family: "Press Start 2P", cursive;
}

.v-alert {
  font-family: "Press Start 2P", cursive;
  margin-bottom: 2rem;
}

.v-icon {
  color: var(--filters);
}

.info_container {
  margin-top: 3rem;
}
</style>
