<template>
  <div class="my-container">
    <h1 style="font-size:55px" class="uk-text-center uk-margin-remove">surasai</h1>
    <p class="uk-text-center uk-margin-remove">ask me anything.</p>

    <div class="uk-margin-small-top" v-if="!email">
      <router-link tag="a" to="/register">Регистрация</router-link>
      <span class="uk-margin-small-left"></span>
      <router-link tag="a" to="/login">Войти</router-link>
    </div>
    <div v-else>
      <router-link v-if="email" tag="a" :to="'/user/' + email">Моя страница</router-link>
    </div>

    <loader v-if="loading"></loader>
  </div>
</template>
<script>
import loader from '../components/Loader'
export default {
  data() {
    return {
      email: null,
      loading: false
    };
  },
  created() {
    this.loading = true
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.loading = false
        this.email = user.email.replace("@surasai.kz", "")
      }
      else this.loading = false
    })

  },
  components: {
    loader
  }
};
</script>
<style  scoped>
.my-container {
  min-height: 200px;
  height: calc(100vh - 170px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
