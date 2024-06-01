<template>
  <v-container v-if="pokemon">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card :style="{ background: getPokemonGradient(pokemon.types) }" class="pokemon-card">
          <v-row>
            <!-- Left Column: Basic Info -->
            <v-col cols="12" md="4" class="left-column">
              <v-card-subtitle> # {{ String(pokemon.id).padStart(2, "0") }}</v-card-subtitle>
              <v-img
                :src="pokemon.sprites.other['official-artwork'].front_default"
                height="200px"
              ></v-img>
              <v-card-title>{{
                pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
              }}</v-card-title>
              <v-card-text>
                <p>Height: {{ pokemon.height / 10 }} m</p>
                <p>Weight: {{ pokemon.weight / 10 }} kg</p>
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
            </v-col>

            <!-- Right Column: Additional Info -->
            <v-col cols="12" md="8" class="right-column">
              <v-card-text>
                <div class="abilities-section">
                  <h3>Abilities</h3>
                  <ul>
                    <li
                      v-for="ability in pokemon.abilities"
                      :key="ability.ability.name"
                      class="ability_list"
                    >
                      {{ ability.ability.name }}
                    </li>
                  </ul>
                </div>
                <div class="stats-section">
                  <h3>Basic Stats</h3>
                  <ul>
                    <li v-for="stat in pokemon.stats" :key="stat.stat.name">
                      <strong>{{ stat.stat.name.toUpperCase() }}:</strong> {{ stat.base_stat }}
                    </li>
                  </ul>
                </div>
              </v-card-text>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn class="back_button" @click="$router.back()">Back</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-alert type="info">Loading...</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { colorTypeGradients } from "../utils";
import { mapActions } from 'vuex';

export default {
  name: "PokemonDetails",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      pokemon: null,
    };
  },
  async created() {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${this.id}`
      );
      this.pokemon = response.data;
      this.addVisitedPokemon({
        id: this.pokemon.id,
        name: this.pokemon.name,
        image: this.pokemon.sprites.other['official-artwork'].front_default,
        types: this.pokemon.types,
      });
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
    }
  },
  methods: {
    ...mapActions(['addVisitedPokemon']),
    getPokemonGradient(types) {
      const typeNames = types.map((type) => type.type.name);
      return `linear-gradient(${colorTypeGradients(
        typeNames[0],
        typeNames[1],
        typeNames.length
      ).join(", ")})`;
    },
  },
};
</script>


<style scoped>
.v-card-text p{
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
  color: var(--pokename);
}

.pokemon-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.left-column {
  text-align: center;
}

.right-column {
  padding: 16px;
}


.about-section,
.abilities-section,
.stats-section,
.evolution-section {
  margin-top: 16px;
}

h3 {
  margin: 8px 0;
  font-family: 'Press Start 2P', cursive;
}

ul {
  padding: 0;
  list-style: none;
  font-family: 'Press Start 2P', cursive;
}

ul li {
  margin: 4px 0;
}

.ability_list{
  list-style: circle;
  margin-left: 15px;
}
</style>
