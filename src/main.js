import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD82NHYrdg9ReTTncyzEM8GMe88MgDwLIU",
  authDomain: "surasai.firebaseapp.com",
  databaseURL: "https://surasai.firebaseio.com",
  projectId: "surasai",
  storageBucket: "",
  messagingSenderId: "69437968197",
  appId: "1:69437968197:web:5ec99fc8a4c818bf"
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