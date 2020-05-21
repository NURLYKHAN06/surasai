<template>
  <div class="uk-container  uk-padding-small  uk-margin-bottom">
    <h2 class="uk-text-center">Список пользователей</h2>
    <table style="font-size:13px" class="uk-table uk-table-striped">
      <thead>
        <tr>
          <th>
            Инфо
            <br />юзера
          </th>
          <th>
            Дата
            <br />создания
          </th>
          <th class="uk-text-center">
            Задано
            <br />вопросов
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.registerDate">
          <td>
            <router-link :to="'/user/' + user.email">{{ user.email}}</router-link>
          </td>
          <td>{{ user.registerDate}}</td>
          <td class="uk-text-center">{{ user.sumQuestions }}</td>
        </tr>
      </tbody>
    </table>
    <loader v-if="loading"></loader>
  </div>
</template>
<script>
import loader from "../components/Loader";

export default {
  data() {
    return {
      users: [],
      test: [],
      loading: false
    };
  },
  created() {
    this.loading = true;

    firebase.database().ref("/users").once("value", data => {
        
        Object.values(data.val()).forEach(user => {
          let userObj = {};
          userObj.email = user.email.replace("@surasai.kz", "");
          userObj.registerDate = user.registerDate;

          if(user.questions){
            userObj.sumQuestions = Object.values(user.questions).length;
          } else {
            userObj.sumQuestions = '0'
          }

          this.users.push(userObj);
        });
        

      })
      .then(() => {
        this.loading = false;
      });
  },
  components: {
    loader
  }
};
</script>
<style>
</style>