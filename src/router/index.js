import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/auth/Login.vue'),
    meta: {
      requiresAuth: false
    }
    
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/auth/Register.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  console.log(isAuthenticated())
  if(!isAuthenticated() && to.matched.some((record) => record.meta.requiresAuth)) {
    next({name: 'login'})
  }
  else if(isAuthenticated() && to.matched.some((record) => !record.meta.requiresAuth)) {
    next({name: 'home'})
  }
  else {
    next();
  }

})

const isAuthenticated = () => {
  return !!localStorage.getItem('authenticated')
}

export default router
