import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import(/* webpackChunkName: "about" */ '../views/Report.vue')
  },

  {
    path: '/schedules',
    name: 'Schedules',
    component: () => import(/* webpackChunkName: "about" */ '../views/Schedules.vue')
  },

  
  {
    path: '/holidays',
    name: 'Holidays',
    component: () => import(/* webpackChunkName: "about" */ '../views/holidays.vue')
  }

]

const router = new VueRouter({
  mode: 'abstract',
  routes
})

export default router
