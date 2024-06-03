<template>
  <v-container>
    <v-row>
      <v-col v-if="visitedPokemon.length === 0" cols="12">
        <v-alert type="info">
          No Pokémon has been viewed yet.
        </v-alert>
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
    <v-btn icon @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { colorTypeGradients } from "../utils";

export default {
  name: "RecentlyViewed",
  setup() {
    const store = useStore();
    const router = useRouter();

    const visitedPokemon = computed(() => store.state.visitedPokemon);

    const viewPokemon = id => {
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
    goBack() {
      this.$router.push({ path: "/" });
    },
  }
};
</script>

<style scoped>
.v-btn {
  margin-top: 15px;
  border: 1px solid var(--colorPrimary);
}

</style>
