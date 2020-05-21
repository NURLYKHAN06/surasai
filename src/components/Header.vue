<template>
  <div>
    <nav class="uk-navbar-container uk-margin" uk-navbar="mode: click">
      <div class="my-nav-container uk-flex uk-flex-between">
        <router-link tag="a" to="/" active-class="my-active-class" style="font-size:18px" exact>
          <a href="/" @click="menuState = false">surasai</a>
        </router-link>
    
        <div class="my-nav-right" ref="dropdownMenu">
          <router-link
            tag="a"
            :to="`/user/${this.$store.getters.user.email.replace('@surasai.kz','')}`"
            active-class="my-active-class"
            exact=""
            v-if="$store.getters.user"
          >Моя страница</router-link>
          <router-link
            tag="a"
            v-for="link in links"
            :key="link.title"
            :to="link.url"
            active-class="my-active-class"
            exact
            :class="{'uk-active': $route.path == '/register' && link.title.toLowerCase() == 'авторизация'}"
          >
            <span @click="menuState = false">{{link.title }}</span>
          </router-link>

          <a v-if="$store.getters.user" href @click.prevent="logoutUser">Выйти</a>

          <p class="author uk-margin-large-top">
            created by
            <a
              href="https://nurlykhan06.github.io/index.html"
              target="_blank"
              class="uk-padding-remove"
              style="font-size:14px"
            >NURLYKHAN</a>
          </p>
        </div>

        <a
          @click.prevent="toggleMenu"
          class="uk-navbar-toggle my-nav-toggle"
          uk-navbar-toggle-icon
          href="#"
        ></a>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuState: false
    };
  },
  watch: {
    menuState() {
      if (this.menuState) {
        this.$refs.dropdownMenu.classList.add("active");
        document.body.style.overflow = "hidden";
      } else {
        this.$refs.dropdownMenu.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    }
  },
  props: {
    links: Array
  },
  methods: {
    logoutUser() {
      this.menuState = false;
      this.$store
        .dispatch("logoutUser")
        .then(() => {
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    toggleMenu() {
      this.menuState = !this.menuState;
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  }
};
</script>
<style>
.author {
  display: none;
}
.my-active-class:hover {
  color: #333;
  text-decoration: none;
}
.my-active-class {
  color: #333;
}
.my-nav-container {
  padding: 20px 20px;
  width: 100%;
}
.my-nav-right a {
  padding: 0 15px;
}
.my-nav-toggle {
  display: none;
  min-height: auto;
  padding: 0 !important;
}
@media (max-width: 640px) {
  .author {
    display: block;
  }
  .my-nav-container {
    align-items: center;
  }
  .my-nav-right a {
    padding: 5px 15px;
    font-size: 25px;
  }
  .my-nav-right {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 47px;
    opacity: 0;
    z-index: -1;
    height: 100%;
    width: 100%;
    background: #f8f8f8;
    left: 0;
    padding-left: 5px;
    flex-direction: column;
    transition: 0.5s all;
  }
  .my-nav-right.active {
    z-index: 99;
    opacity: 1;
  }
  .my-nav-toggle {
    display: block;
  }
}
</style>
