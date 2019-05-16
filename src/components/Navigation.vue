<template>
  <div>
    <h2>Nav Bar</h2>
    <nav>
      <!--Creates a new router-link for every object in links (below under data)-->
      <router-link class="spacing" v-for="routes in links" 
      v-bind:key="routes.id"
      :to="`${routes.page}`">{{routes.text}}</router-link>
      <!--The <router-link></router-link> is specific to Vue Router. When using Vue-Router, you do not need to use <a></a> to link to another page. to="" is what path you are going to link to.-->
    </nav>
  </div>
</template>

<script>
export default {
    name: 'Navigation', //this is the name of the component
    data() {
        return {
            links: [
                {
                    id: 0,
                    text: 'Hello World',
                    page: '/HelloWorld'
                },
                {
                    id: 1,
                    text: 'Contact',
                    page: '/Contact'
                },
                {
                    id: 2,
                    text: 'Section1',
                    page: '/Section1'
                },
                {
                    id: 3,
                    text: 'GMap',
                    page: '/GMap'
                }
            ]
        }
    }
}
</script>

<style> 
  .spacing { 
    Margin-right: 10px;
    color:red; 
  } 
</style>