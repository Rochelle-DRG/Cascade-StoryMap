import Vue        from 'vue'
import Router     from 'vue-router'
import GMap       from '@/components/GMap'
import TMap       from '@/components/TMap'
import Welcome     from '@/components/Welcome'
import Contact    from '@/components/Contact'
import Section1   from '@/components/Section1'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history', //this eliminates the # but will cause the page to reload
  routes: [
    // {
    //   path: '/',
    //   redirect: '/gd'
    // }, 
    {
      path: '/gd',
      name: '高德地图',
      component: GMap
    },
    {
      path: '/tian',
      name: '天地图',
      component: TMap
    },
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/Welcome',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/Section1',
      name: 'Section1',
      component: Section1
    },
    {
      path: '/Contact',
      name: 'Contact',
      component: Contact
    },
  ]
})
