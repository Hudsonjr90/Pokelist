import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Pokemon from './views/Pokemon.vue';
import RecentlyViewed from './components/RecentlyViewed.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/pokemon/:id', component: Pokemon },
  { path: '/recently-viewed', component: RecentlyViewed}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;