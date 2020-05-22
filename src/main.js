import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'

// Initialize Firebase
firebase.initializeApp({
// config date
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  created() {
    firebase.auth().onAuthStateChanged(user => user ? this.$store.dispatch('autoSignIn', user) : '')
  },
  router,
}).$mount('#app')
