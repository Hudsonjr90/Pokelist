<template>
  <div>
    <v-app v-if="!loading">
      <v-app-bar app>
        <v-toolbar-title @click="goHome" style="cursor: pointer;">
          <img
            src="./assets/images/pokedex.png"
            alt="Pokémon Logo"
            height="40"
          />
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="viewVisitedPokemons">
          <v-icon>mdi-history</v-icon>
        </v-btn>
        <v-btn icon @click="toggleTheme">
          <v-icon>{{
            $vuetify.theme.dark ? "mdi-weather-sunny" : "mdi-weather-night"
          }}</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
    <div v-else class="loading-container">
      <img
        src="https://i.gifer.com/VgI.gif"
        class="loading-gif noselect"
        alt="loading-gif"
      />
      <div class="loading__text">Loading...</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    goHome() {
      this.$router.push({ path: "/" });
    },
    viewVisitedPokemons() {
      this.$router.push({ path: "/recently-viewed" });
    },
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  },
};
</script>

<style scoped>
.loading__text {
  font-family: "Press Start 2P", cursive;
  color: var(--colorPrimary);
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.loading-gif {
  width: 100px;
  height: 100px;
}
.noselect {
  user-select: none;
}
</style>
