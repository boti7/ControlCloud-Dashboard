<template>
  <b-container fluid="">
    <div class="login-form">
      <b-alert variant="warning" :show="loginError">Invalid email or password</b-alert>
      <b-form @submit.prevent="login">
        <b-form-group>
          <b-form-input type="email" v-model="email" placeholder="Email address" required />
        </b-form-group>
        <b-form-group>
          <b-form-input type="password" v-model="password" placeholder="Password" required />
        </b-form-group>
        <b-form-group>
          <b-button type="submit" variant="primary" block>Login</b-button>
        </b-form-group>
      </b-form>
    </div>
  </b-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from "vue-class-component"

  @Component({
    name: 'LoginPage'
  })
  export default class Login extends Vue {
    loginError = false
    email = ''
    password = ''

    async login() {
      this.loginError = false

      try {
        await this.$auth.login(this.email, this.password)
      }
      catch (e) {
        this.loginError = true
        console.log(this.loginError)
        return
      }

      await this.$router.replace('/')
    }
  }
</script>

<style scoped>
  .login-form {
    display: block;
    width: 100%;
    max-width: 330px;
    margin: 20px auto;
  }
</style>
