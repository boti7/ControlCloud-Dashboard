<template>
  <b-navbar toggleable="md">
    <b-navbar-brand href="/">
      <img src="~/assets/cc_konturos_kicsi.png"  alt="logo"/>
      Control Cloud
    </b-navbar-brand>

    <b-navbar-toggle v-if="$auth.isLoggedIn" target="nav-collapse"></b-navbar-toggle>

    <b-collapse v-if="$auth.isLoggedIn" id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown toggle-class="user-menu" right>
          <template v-slot:button-content>{{ userEmailAddress || 'User menu' }}</template>

          <b-dropdown-item @click="$auth.logout()">
            <b-icon-box-arrow-right /> Log out
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { BIconBoxArrowRight } from 'bootstrap-vue'

  @Component({
    name: 'Navbar',
    components: { BIconBoxArrowRight },
  })
  export default class Navbar extends Vue {
    get userEmailAddress() {
      return this.$auth.profile?.email
    }
  }
</script>

<style scoped>
  .navbar {
    background-color: white;
    border: none;
    border-bottom: 3px solid #8EA5D8;
    border-radius: 0;
  }

  .navbar-brand {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 300;
    color: #2F54A5 !important;
  }

  .navbar-brand img {
    width: 40px;
    float: left;
    margin: 0 10px;
  }
</style>
