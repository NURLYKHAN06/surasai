<template>
  <div>
    <h3 class="uk-text-center uk-margin-small-bottom">
      {{ email }}
      <span
        class="uk-badge"
        v-show="+newQuestions > 0 && admin === true"
      >{{ newQuestions }}</span>
    </h3>

    <h2 class="uk-text-center uk-margin-remove-vertical">{{ username }}</h2>
    <p class="uk-text-center uk-margin-small-top">Дата регистрации {{date}}</p>

    <!-- Form block -->
    <div class="uk-padding-small form-wrap">
      <form>
        <fieldset class="uk-fieldset">
          <legend class="uk-legend">Задать вопрос</legend>

          <div class="uk-margin">
            <input
              class="uk-input"
              ref="questionInput"
              type="text"
              v-model="yourQuestion"
              placeholder="Кеш жарыққада дәптер арнаймызба?)"
            />
          </div>

          <error :errorState="errorState" :errors="errors"></error>

          <button
            class="uk-button uk-button-primary"
            style="display:block;margin-left:auto"
            @click.prevent="sendQuestion"
          >Отправить</button>
        </fieldset>
      </form>
    </div>
    <!-- Questions Block -->
    <div class="questions uk-background-primary uk-padding-small">
      <h2
        class="uk-light uk-margin-remove uk-text-center uk-padding-large"
        v-if="questions.length == 0"
      >Вопросов нет.</h2>

      <div
        class="question uk-card uk-card-default uk-width-1-2@m uk-margin-auto uk-margin-top uk-margin-bottom"
        v-for="question in sortedQuestions"
        :key="question.id"
      >
        <div class="uk-card-header">
          <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-expand">
              <h3 class="question-text uk-card-title uk-margin-remove-bottom">{{ question.question}}</h3>
              <p class="uk-text-meta uk-margin-remove-top">
                <time :datetime="question.date">{{ question.date}}</time>
              </p>
            </div>
          </div>
        </div>
        <div class="answer-text uk-card-body uk-padding-remove">
          <p v-if="admin === false">{{ question.answer}}</p>
          <div class="answer-form" v-if="admin">
            <p>{{ question.answer }}</p>
            <input class="uk-input" type="text" :placeholder="question.answer" />
            <div class="uk-button-group uk-margin-top">
              <button
                class="uk-button uk-button-primary uk-button-small uk-text-ligher"
                @click="answerQuestion"
                :data-id="question.id"
              >Ответить</button>
              <button
                class="uk-button uk-button-danger uk-button-small uk-text-lighter"
                @click="deleteQuestion"
                :data-id="question.id"
              >Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- End Questions Block -->

    <loader v-if="loading"></loader>
  </div>
</template>
<script>
import loader from "../components/Loader";
import error from "../components/Error";
import watchMixin from "./watch.mixin";

export default {
  mixins: [watchMixin],
  data() {
    return {
      onlyUserComponent: true,
      newQuestions: Number,
      admin: false,
      loading: true,
      email: this.$router.currentRoute.params["email"],
      username: "",
      id: "",
      password: "",
      date: "",
      errorState: false,
      errors: [],
      yourQuestion: "",
      questions: []
    };
  },
  computed: {
    sortedQuestions: function() {
      let a = this.questions.sort(function(a, b) {
        return new Date(b.dateForSort) - new Date(a.dateForSort);
      });
      return a;
    }
  },
  methods: {
    sendQuestion() {
      if (this.yourQuestion.trim().length < 5) {
        this.errors.length = 0;
        this.errorState = true;
        this.errors.push("Минимум 5 символов");
        this.$refs.questionInput.classList.add("uk-form-danger");
      } else {
        this.loading = true;
        let nowDate = new Date();

        let questionId = firebase
          .database()
          .ref("/users/" + this.id + "/questions")
          .push().key;

        firebase
          .database()
          .ref("/users/" + this.id + "/questions/" + questionId)
          .set({
            question: this.yourQuestion,
            answer: "Не отвечено",
            date: `${nowDate.toLocaleDateString(
              "en-GB"
            )} ${nowDate.getHours()}:${nowDate.getMinutes()}`,
            dateForSort: `${nowDate.toLocaleDateString(
              "en-GB"
            )} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`,
            id: questionId
          })
          .then(() => {
            this.updateQuestions();
          })
          .then(() => {
            this.yourQuestion = "";
            this.loading = false;
          });
      }
    },
    async updateQuestions() {
      this.loading = true;
      this.newQuestions = 0;
      let obj = {};
      await firebase
        .database()
        .ref("/users")
        .once("value", data => {
          this.questions.length = 0;

          Object.values(data.val()).forEach(someData => {
            if (someData.email.replace("@surasai.kz", "") === this.email) {
              obj = someData;

              if (someData.questions) {
                Object.values(someData.questions).forEach(question => {
                  if (question.answer == "Не отвечено") {
                    this.newQuestions++;
                  }

                  this.questions.push(question);
                });
              }
            }
          });
        });

      this.loading = false;

      return obj;
    },
    deleteQuestion() {
      let questionId = event.target.dataset.id;
      this.loading = true;

      firebase
        .database()
        .ref("/users/" + this.id + "/questions/" + questionId)
        .set(null)
        .then(() => {
          this.updateQuestions();
        });
    },
    answerQuestion() {
      let questionId = event.target.dataset.id;
      let myAnswer = event.target.parentNode.previousSibling.value;
      if (myAnswer.trim()) {
        this.loading = true;
        firebase
          .database()
          .ref("/users/" + this.id + "/questions/" + questionId)
          .update({
            answer: myAnswer
          })
          .then(() => {
            this.updateQuestions();
            this.loading = false;
          });
      }
    },
    initApp(){
   let emails = [];
    firebase
      .database()
      .ref("/users")
      .once("value", data => {
        Object.values(data.val()).forEach(user => {
          emails.push(user.email.replace("@surasai.kz", ""));
        });

        if (emails.includes(this.email) === false) {
          this.$router.push("/error");
        }
      });

    let obj = {};
    this.updateQuestions()
      .then(data => {
        obj = data;
        this.loading = false;
        this.id = obj.id;
        this.username = obj.username;
        this.date = obj.registerDate;
      })
      .then(() => {
        // Admin
        if (this.$store.getters.user) {
          if (
            this.$store.getters.user.email.replace("@surasai.kz", "") ===
            this.email
          ) {
            this.admin = true;
          }
        }
      });
    }
  },
  created() {
    this.initApp()
  },
  components: {
    error,
    loader
  },
};
</script>

<style scoped>
p {
  word-break: break-all;
}
.answer-text {
  padding: 15px 30px !important;
}
.form-wrap {
  max-width: 400px;
  margin: 0 auto;
}
@media (min-width: 1200px) {
  .answer-text {
    padding: 15px 40px !important;
  }
}
</style>