<template>
  <div class="uk-container uk-padding-small  uk-margin-bottom">
    <success
      :successState="successState"
      :successText="successText"
      @closeAlert="successState = false"
    ></success>

    <div class="uk-container-xsmall form-container uk-margin-auto">
      <form>
        <fieldset class="uk-fieldset">
          <legend class="uk-legend">Регистрация нового пользователя</legend>

          <div class="uk-margin">
            <p class="uk-margin-small-bottom">Ваше полное имя</p>
            <input
              class="uk-input"
              ref="fullname"
              v-model="username"
              type="text"
              placeholder="Пацан Молодой"
            />
          </div>

          <div class="uk-margin">
            <p class="uk-margin-small-bottom">Имя пользователя</p>
            <input
              class="uk-input"
              ref="username"
              v-model="email"
              type="email"
              placeholder="nukaizpimka"
            />
          </div>

          <div class="uk-margin">
            <p class="uk-margin-small-bottom">Ваш пароль</p>
            <input
              class="uk-input"
              ref="password"
              v-model="password"
              type="password"
              placeholder="mamapapa2015"
            />
          </div>

          <div class="uk-margin">
            <p class="uk-margin-small-bottom">Повторите пароль</p>
            <input
              class="uk-input"
              ref="repeatPassword"
              v-model="repeatPassword"
              type="password"
              placeholder="mamapapa2015"
            />
          </div>

          <error :errorState="errorState" :errors="errors"></error>

          <div class="uk-flex uk-flex-between">
            <router-link to="/login" tag="button" class="uk-button uk-button-link">Войти</router-link>
            <button class="uk-button uk-button-primary" @click.prevent="registerUser">Регистрация</button>
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
import success from "../components/Success";
import watchMixin from "./watch.mixin";
//
export default {
  mixins: [watchMixin],
  data() {
    return {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      errors: [],
      errorState: false,
      loading: false,
      successState: false,
      successText: "",
      createdUsername: ""
    };
  },
  methods: {
    registerUser() {
      this.successState = false;
      const user = {
        username: this.username,
        email: this.email,
        password: this.password,
        repeatPassword: this.repeatPassword
      };

      this.validator(user);
    },
    validator(user) {
      let username = user.username;
      let email = user.email;
      let password = user.password;
      let repeatPassword = user.repeatPassword;

      let inputStates = {
        username: false,
        email: false,
        password: false,
        repeatPassword: false
      };

      if (username.trim().length > 4) {
        this.$refs.fullname.classList.remove("uk-form-danger");
        inputStates.username = true;
      } else {
        this.$refs.fullname.classList.add("uk-form-danger");
        this.validatorHelper("Полное имя должен быть больше 4 символов");
      }

      if (email.trim().length > 3) {
        this.$refs.username.classList.remove("uk-form-danger");
        inputStates.email = true;
      } else {
        this.$refs.username.classList.add("uk-form-danger");
        this.validatorHelper("Имя пользователя должен быть больше 3 символов");
      }
      if (password.trim().length > 6) {
        this.$refs.password.classList.remove("uk-form-danger");
        inputStates.password = true;
      } else {
        this.$refs.password.classList.add("uk-form-danger");
        this.validatorHelper("Пароль должен быть больше 6 символов");
      }

      if (!password.trim()) {
        password = null;
      }

      if (password === repeatPassword) {
        this.$refs.repeatPassword.classList.remove("uk-form-danger");
        inputStates.repeatPassword = true;
      } else {
        this.$refs.repeatPassword.classList.add("uk-form-danger");
        this.validatorHelper("Пароли должны совпадать");
      }

      let statesArray = Object.values(inputStates);
      let resultState = statesArray.every(state => state === true);

      if (resultState) {
        this.loading = true;
        this.$store
          .dispatch("registerUser", user)
          .then(someData => {
            this.loading = false;

            try {
              if (someData.code == "auth/email-already-in-use") {
                this.$refs.username.classList.add("uk-form-danger");
                this.validatorHelper("Имя пользователя занято");
              } else {
                if (someData.code) {
                  // Something wrong
                  this.errorState = true;
                  this.errors.push("Что-то не так");
                }
              }
            } catch (success) {
              this.createdUsername = username;
              this.email = "";
              this.username = "";
              this.password = "";
              this.repeatPassword = "";
              this.successState = true;
              this.successText = `Учетная запись успешно создана. Можете войти в систему, уважаемый(-ая) ${this.createdUsername}. Наслаждайтесь!`;
            }
          })
          .catch(error => console.log(error.message));
      }
    },
    validatorHelper(errorMessage) {
      this.errorState = true;
      this.errors.push(errorMessage);
      this.errors = this.errors.filter((error, index) => {
        return this.errors.indexOf(error) >= index;
      });
    }
  },
  components: {
    error,
    loader,
    success
  },
  created() {}
};
</script>

