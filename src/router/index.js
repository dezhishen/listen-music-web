import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'play',
      component: resolve => (require(['@/components/Play'], resolve))
    },
    {
      path: '/search',
      name: 'search',
      component: resolve => (require(['@/components/Search'], resolve))
    },
    {
      path: '/play',
      name: 'play',
      component: resolve => (require(['@/components/Play'], resolve))
    }
  ]
})
