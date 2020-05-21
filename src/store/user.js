// Please dont touch ok i dont want problems with my

export default {
  state: {
    user: null,
  },
  mutations: {
    setUser(state, gottenUser) {
      state.user = gottenUser;
    },
  },
  actions: {
    async registerUser({ commit }, gottenUser) {
      gottenUser.email += "@surasai.kz";

      try {
        const createdUser = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            gottenUser.email,
            gottenUser.password
          );
        const fullUser = {
          id: createdUser.user.uid,
          email: createdUser.user.email,
          username: gottenUser.username,
          password: gottenUser.password,
          registerDate: `${new Date().toLocaleDateString(
            "en-GB"
          )} ${new Date().getHours()}:${new Date().getMinutes()}`,
        };

        firebase
          .database()
          .ref("/users/" + fullUser.id)
          .set(fullUser);
      } catch (error) {
        return error;
      }
    },
    async signInUser({ commit }, gottenUser) {
      gottenUser.email += "@surasai.kz";
      try {
        const user = await firebase
          .auth()
          .signInWithEmailAndPassword(gottenUser.email, gottenUser.password);
        await firebase
          .database()
          .ref("users/" + user.user.uid)
          .once("value", (data) => {
            commit("setUser", data.val());
          });
      } catch (error) {
        return error;
      }
    },
    async autoSignIn({ commit }, gottenUser) {
      await firebase
        .database()
        .ref("users/" + gottenUser.uid)
        .once("value", (data) => {
          commit("setUser", data.val());
        });
    },
    logoutUser({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          commit("setUser", null);
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
  getters: {
    user: function (state) {
      return state.user;
    },
  },
};
