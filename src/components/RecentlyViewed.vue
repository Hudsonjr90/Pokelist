<template>
  <v-container>
    <v-row justify="center">
      <h1>History</h1>
    </v-row>
    <v-row justify="center">
      <v-col v-if="visitedPokemon.length === 0" cols="6" align="center">
        <v-alert type="info"> Nothing seen yet </v-alert>
        <img
        src="../assets/images/cute.gif"
        class="loading-gif noselect"
        alt="loading-gif"
        width="50%"
      />
      </v-col>
      <template v-else>
        <v-col
          v-for="pokemon in visitedPokemon"
          :key="pokemon.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            :style="{ background: getPokemonGradient(pokemon.types) }"
            @click="viewPokemon(pokemon.id)"
          >
            <v-card-title>{{
              pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
            }}</v-card-title>
            <v-img :src="pokemon.image" height="200px"></v-img>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <v-btn icon @click="$router.back()">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </v-container>
  
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { colorTypeGradients } from "../utils";

export default {
  name: "RecentlyViewed",
  setup() {
    const store = useStore();
    const router = useRouter();

    const visitedPokemon = computed(() => store.state.visitedPokemon);

    const viewPokemon = (id) => {
      router.push(`/pokemon/${id}`);
    };

    return { visitedPokemon, viewPokemon };
  },
  methods: {
    getPokemonGradient(types) {
      const typeNames = types.map((type) => type.type.name);
      return `linear-gradient(${colorTypeGradients(
        typeNames[0],
        typeNames[1],
        typeNames.length
      ).join(", ")})`;
    },
  }
};
</script>

<style scoped>
.v-btn {
  margin-top: 15px;
  border: 1px solid var(--colorPrimary);
}

.v-alert {
  font-family: "Press Start 2P", cursive;
  margin-bottom: 2rem;
}

h1{
  color: var(--filters);
  font-family: "Press Start 2P", cursive;
  margin: 2rem;
}
</style>
