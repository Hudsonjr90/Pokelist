<template>
  <v-container>
    <PokemonDetails :id="$route.params.id" />
  </v-container>
</template>

<script>
import PokemonDetails from '../components/PokemonDetails.vue';

export default {
  name: 'Pokemon',
  components: {
    PokemonDetails,
  },
};
</script>