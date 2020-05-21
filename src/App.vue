<template>
  <div>
    <Header :links="links"></Header>
    <router-view :key="$route.path"></router-view>
    <footer class="uk-margin-medium-remove uk-background-secondary">
      <p style="padding-top:5px" class="uk-margin-remove uk-text-center">
        created by
        <a
          href="https://nurlykhan06.github.io/index.html"
          target="_blank"
          class="uk-padding-remove"
          style="font-size:14px"
        >NURLYKHAN</a>
      </p>
    </footer>
  </div>
</template>
<script>
import Header from "./components/Header";
export default {
  data() {
    return {};
  },
  computed: {
    links() {
      if (this.$store.getters.user) {
        return [
          {
            title: "Пользователи",
            url: "/users"
          }
        ];
      } else {
        return [
          {
            title: "Авторизация",
            url: "/login"
          },
          {
            title: "Пользователи",
            url: "/users"
          }
        ];
      }
    }
  },
  components: {
    Header
  }
};
</script>
<style>
html,
body {
  min-width: 320px;
}
footer {
  padding: 25px;
}
</style>
