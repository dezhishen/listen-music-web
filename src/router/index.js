import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
