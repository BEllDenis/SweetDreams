<script>

export default {
  components: {},
  props: ['user'],
  data() {
    return {

    };
  },
  methods: {
    ToHome() {
      this.$router.push({ name: "home" })
    },
    ToCatalog() {
      this.$router.push({ name: "catalog" })
    },
    ToBasket() {
      this.$router.push('/basket')
    },
    ToAboutUs() {
      this.$router.push({ name: "aboutus" })
    },
    LogoutRequest() {
      this.$emit('LogoutRequest');
    }

  },
  computed: {

  },
  mounted() {
    
  }
};
</script>

<template>
  <header class="flex-row">
    <img
      class="logo"
      src="../assets/images/LandingPage/SweetDreams_Logo@2x.png"
      alt="Логотип"
      @click="this.$router.push('/')"
    />

    <nav class="flex-row">
      <a class="button nav-button flex-row" :class="{'filled': $route.name == 'home'}" @click="ToHome()">
        <i class="icon-home icon"></i>
        <p class="nav-button_text">ГЛАВНАЯ</p>
      </a>

      <a class="button nav-button flex-row" :class="{'filled': $route.name == 'catalog'}" @click="ToCatalog()">
        <i class="icon-catalog icon"></i>
        <p class="nav-button_text">КАТАЛОГ</p>
      </a>

      <a v-if="user" class="button nav-button flex-row" @click="ToBasket" :class="{'filled': $route.name == 'basket'}">
        <i class="icon-shoppong_busket icon"></i>
        <p class="nav-button_text">КОРЗИНА</p>
      </a>

      <a v-if="user" class="button nav-button flex-row">
        <i class="icon-order icon"></i>
        <p class="nav-button_text">ЗАКАЗЫ</p>
      </a>

      <a class="button nav-button flex-row" :class="{'filled': $route.name == 'aboutus'}" @click="ToAboutUs()">
        <i class="icon-info icon"></i>
        <p class="nav-button_text">О НАС</p>
      </a>

      

      <div class="separate-line"></div>

      

      <a v-if="user" class="button nav-button flex-row" @click="LogoutRequest">
        <i class="icon-user icon"></i>
        <p class="nav-button_text">{{ user.Name }} {{ user.Surname }}</p>
      </a>

      <a  v-else class="button nav-button flex-row" @click="this.$router.push('/login')"
      >
        <i class="icon-entrance icon"></i>
        <p class="nav-button_text">ВОЙТИ</p>
      </a>
    </nav>
  </header>
</template>

<style>
/* ========================= HEADER ========================= */
header {
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 10;

  justify-items: center;
  align-items: center;
  justify-content: space-between;

  width: auto;
  height: var(--header-height);

  padding: 0px 120px;

  background-color: var(--white);
  filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2));
}

.logo {
  height: 70%;

  cursor: pointer;
}

/* ------------- Nav ------------- */
nav {
  align-items: center;
  gap: 1.5rem;
}


.nav-button_text {
  padding-top: 0.3rem;

  font-size: 1.3rem;
  letter-spacing: 0.1rem;
}

.separate-line {
  width: 3px;
  height: 45px;
  border-radius: 100px;
  background-color: var(--white-pink);
}
</style>
