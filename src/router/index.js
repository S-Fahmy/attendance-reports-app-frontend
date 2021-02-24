import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',

    component: () => import('../views/About.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/Report.vue'),
    beforeEnter: authGuard
  },

  {
    path: '/schedules',
    name: 'Schedules',
    component: () => import('../views/Schedules.vue'),
    beforeEnter: authGuard
  },

  
  {
    path: '/holidays',
    name: 'Holidays',
    component: () => import('../views/holidays.vue'),
    beforeEnter: authGuard
  }

]

const router = new VueRouter({
  mode: 'abstract',
  routes
})

export default router

