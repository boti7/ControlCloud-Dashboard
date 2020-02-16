<template>
  <div>
    <Navbar />

    <nuxt />
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar.vue'

  export default {
    components: {
      Navbar,
    }
  }
</script>

<style>
html {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  background-color: #f5f5f5;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
