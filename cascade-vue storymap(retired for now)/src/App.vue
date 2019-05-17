<template>

  <div id="app">
      <!-- Don't need these now linking in Navigation.vue
      <router-link to="/HelloWorld" class="button">HelloWorld</router-link>
      <router-link to="/" class="button">Welcome</router-link>
      -->
      <Navigation></Navigation>
      <router-view></router-view>
      
  </div>
</template>

<script>
import Navigation from './components/Navigation';
export default {
  name: 'App',
  components: {
    'Navigation': Navigation
  }
};


</script>

<style lang="postcss">
html,
body,
#app {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}
#app {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
}
.header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    box-sizing: border-box;
    & .button {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        background: #03a9f4;
        padding: 3px 7px;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: normal;
    }
    & .button:hover {
        background: #0179af;
    }
}
.content {
    width: 100%;
    height: calc(100%-50px);
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
