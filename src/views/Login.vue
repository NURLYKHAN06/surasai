<template>
  <div class="uk-container uk-padding-small uk-margin-bottom">
    <div class="uk-container-xsmall form-container uk-margin-auto">
      <form>
        <fieldset class="uk-fieldset">
          <legend class="uk-legend">Войти в систему</legend>

          <div class="uk-margin">
            <p class="uk-margin-small-bottom">Имя пользователя</p>
            <input
              ref="email"
              class="uk-input"
              v-model="email"
              type="email"
              placeholder="nukaizpimka"
            />
          </div>

          <div class="uk-margin">
            <p class="uk-margin-small-bottom">Ваш пароль</p>
            <input
              ref="password"
              class="uk-input"
              v-model="password"
              type="password"
              placeholder="mamapapa2015"
            />
          </div>

          <error :errorState="errorState" :errors="errors"></error>

          <div class="uk-flex uk-flex-between">
            <router-link to="/register" tag="button" class="uk-button uk-button-link">Регистрация</router-link>
            <button class="uk-button uk-button-primary" @click.prevent="signInUser">Войти</button>
          </div>
        </fieldset>
      </form>
    </div>
    <loader v-if="loading"></loader>
  </div>
</template>
<script>
import error from "../components/Error";
import loader from "../components/Loader";
import watchMixin from "./watch.mixin";

export default {
  mixins: [watchMixin],
  data() {
    return {
      email: "",
      password: "",
      errorState: false,
      errors: [],
      loading: false
    };
  },
  methods: {
    signInUser() {
      const user = {
        email: this.email,
        password: this.password
      };

      if (this.email.trim().length > 3 && this.password.trim().length > 6) {
        this.loading = true;
        this.$store.dispatch("signInUser", user).then(result => {
          try {
            if (result.code) {
              this.showError("Неправильный email или пароль");
              this.loading = false;
            }
          } catch (error) {
            this.loading = false;
            this.$router.push(`/user/${this.email}`);
          }
        });
      } else {
        this.showError("Неправильный email или пароль");
      }
    },
    showError(errorMessage) {
      this.errors.push(errorMessage);
      this.errorState = true;
      this.$refs.email.classList.add("uk-form-danger");
      this.$refs.password.classList.add("uk-form-danger");

      this.errors = this.errors.filter((error, index) => {
        return this.errors.indexOf(error) >= index;
      });
    }
  },
  components: {
    error,
    loader
  }
};
</script>
<style>
.form-container {
  max-width: 400px;
}
</style>
