import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  getPokemons() {
    return apiClient.get('/pokemon');
  },
  getPokemonDetails(name) {
    return apiClient.get(`/pokemon/${name}`);
  },
};
