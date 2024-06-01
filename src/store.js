// store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    visitedPokemon: [],
  },
  mutations: {
    addVisitedPokemon(state, pokemon) {

      if (!state.visitedPokemon.some(p => p.id === pokemon.id)) {
        state.visitedPokemon.push(pokemon);
        
        localStorage.setItem('visitedPokemon', JSON.stringify(state.visitedPokemon));
      }
    },
    loadVisitedPokemon(state) {
      const visited = localStorage.getItem('visitedPokemon');
      if (visited) {
        state.visitedPokemon = JSON.parse(visited);
      }
    },
  },
  actions: {
    addVisitedPokemon({ commit }, pokemon) {
      commit('addVisitedPokemon', pokemon);
    },
    loadVisitedPokemon({ commit }) {
      commit('loadVisitedPokemon');
    },
  },
});
