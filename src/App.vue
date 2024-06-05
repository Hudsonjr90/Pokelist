<template>
    <v-app >
      <v-app-bar app >
        <v-toolbar-title>
          <img
            src="./assets/images/pokedex.png"
            alt="Pokémon Logo"
            height="40"
          />
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="viewVisitedPokemons" v-tooltip:left="'History'">
          <v-icon >mdi-history</v-icon>
        </v-btn>
        <v-btn icon @click="toggleTheme">
          <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
</template>

<script>
export default {
  data() {
    return {
      isDarkTheme: false,
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      this.$vuetify.theme.dark = this.isDarkTheme;
      document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');    },
    viewVisitedPokemons() {
      this.$router.push({ path: "/history" });
    },
    
  },
  mounted(){
  },
  created() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.$vuetify.theme.dark = this.isDarkTheme;
      document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
    }
  },
  watch: {
    isDarkTheme(newVal) {
      localStorage.setItem('theme', newVal ? 'dark' : 'light');
    },
  },
};
</script>

<style scoped>
.v-app-bar{
  background-color: var(--navbgcolor) !important;
  background-repeat: repeat !important;
}
.v-icon{
  color: var(--filters);
}
</style>
