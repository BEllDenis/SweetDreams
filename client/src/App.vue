<script>
import C_Header from './components/C_Header.vue'
import C_Footer from './components/C_Footer.vue'
import C_IsNotAuth from './components/С_IsNotAuth.vue'
import C_Preloader from './components/C_Preloader.vue'

import U_Registration from './views/U_Registration.vue'
import U_LogIn from './views/U_LogIn.vue'

import { RouterView } from 'vue-router'

import axios from 'axios'

export default {
  components: {
    C_Header, C_Footer, C_IsNotAuth, C_Preloader, RouterView, U_Registration, U_LogIn
  },
  data() {
    return {
      user: null // Cостояние пользователя
    }
  },
  methods: {
    // Метод для обновления данных пользователя
    setUser(userData) {
      this.user = userData;
    },
    
    // Метод для проверки авторизации
    async checkAuth() {
      try {
        const response = await axios.get('/api/me', {withCredentials: true});

        if (response.data.user) {
          this.user = response.data.user; // Если сервер возвращает массив
        }

      } catch (error) {
        this.user = null;
      }
    },
    async Logout() {
      const modal = document.querySelector('.modal_logout')
      modal.close()

      const response = await axios.post('/logout');

      if (response.status === 200) {
        this.$router.push('/');
        this.checkAuth()
      }
      
      
    },
    OpenModal() {
      const modal = document.querySelector('.modal_logout')
      modal.showModal()
    },
    CloseModal() {
      const modal = document.querySelector('.modal_logout')
      modal.close()
    }
  },
  provide() {
    return {
      setUser: this.setUser, // Пробрасываем метод вниз
      checkAuth: this.checkAuth
    }
  },
  async mounted() {
    await this.checkAuth(); // Проверяем авторизацию при загрузке приложения
  }
}
</script>

<template>
  
  <C_Header :user="user" @LogoutRequest="OpenModal"/>
    
    <!-- @login-success="checkAuth" -->
    <RouterView></RouterView>

    <!-- Модальное окно / Поп-ап логаута -->
    <dialog class="modal modal_logout" >
      <div class="modal-inner flex-col">
        <!-- Текст -->
        <div class="flex-col">
          <p class="text-center">Вы авторизованы как:</p>
          <p class="username text-center" v-if="user">{{ user.Name }} {{ user.Surname }}</p>
        </div>
        
        <!-- Кнопки -->
        <div class="flex-row">
          <button type="submit" class="button filled flex-row w100" @click="Logout" >
            <i class="icon-sign_out icon"></i>
            <p class="button_text">Выйти</p>
          </button>
          <button class="button outlined flex-row w100" @click="CloseModal" >
            <i class="icon-close icon"></i>
            <p class="button_text" >Закрыть</p>
          </button>
        </div>
      </div>
    </dialog>

    
  
  <C_Footer/>
  
</template>

<style>

html, dialog {
  user-select: none;
}

/* Добавление шрифта */
@font-face {
  font-family: "Cygre";
  src: url("./assets/fonts/Cygre-SemiBold.woff2");
  font-weight: 500;
  font-style: normal;
}

/* Переменные */
:root {
  /* Цвета */
  --pink: rgb(255, 0, 106); 
  --white-pink: rgb(255, 202, 224);
  --pink-white: rgb(255, 169, 205);
  --white: #FFFFFF;
  --accent-col: rgb(255, 119, 176);
  --accent-col-2: rgb(255, 216, 232);
  --gray: rgb(200,200,200);
  --invalid: rgb(255, 174, 0);
  /* --invalid: rgb(255, 217, 0); */

  /* Числа */
  --header-height: 70px;
  --page-header-margin: 60px;
  --button-outline-width: 3px;

}

/* Глобальные (заранее сделанные) стили */

html::-webkit-scrollbar {
  display: none;
}

.d-none { 
  display: none !important
}

body {
  font-family: "Cygre";
  color: #FF006A;

  cursor: default;
  
  
  line-height: 1;
  /* background-image: url(./assets/images/triangle-mosaic.webp);
  background-size: 25%;
  background-position: center center; */
}



.wrapper {
  padding: 0px 120px;
}

p, li {
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
}

h1, h2 {
  font-size: 7rem;
}

h2 {
  text-align: center;
  line-height: 0.8;
}

h3 {
  font-size: 2.1rem;
}

.fs-1rem {
  font-size: 1rem;
}

.fs-1-5rem {
  font-size: 1.5rem;
}

.fs-1-7rem {
  font-size: 1.7rem;
}

.fs-2rem {
  font-size: 2rem;
}

.fs-2-5rem {
  font-size: 2.5rem;
}

.fs-3rem {
  font-size: 3rem;
}

a {
  color: inherit
}

a, i, p, .button {
  border: none;
  transition: transform 0.2s, color 0.2s, background-color 0.2s; /* Заменил scale на transform */
  transition-timing-function: cubic-bezier(0.3, 0, 0.31, 0.99);
  will-change: transform; /* Оптимизация анимации */
}

.button, .check-box, .radio-button {
  cursor: pointer; 
  font-family: inherit;

  border-style: none;
  outline-style: none;
}

.button {
  display: inline-flex;

  color: var(--pink);
  background-color: transparent;

  padding: 0.7rem 0.7rem;
  gap: 0.7rem;
  
  border-radius: 0.7rem;
  
  justify-content: center;
  align-items: center;

  text-align: center;
}

.button:hover {
  transform: scale(1.1);
  color: var(--accent-col);
}

/* FiLLED */

.button.filled   {
  color: var(--white);
  background-color: var(--pink);
}

.button.filled:hover {
  background-color: var(--accent-col)
}

/* OUTLiNED */

.button.outlined {
  color: var(--pink);
  background-color: var(--white);

  &.white {
    color: var(--white);
    background-color: transparent;
    outline-color: var(--white);
  }

  outline: var(--button-outline-width) solid var(--pink);
  outline-offset: calc(var(--button-outline-width) - ( var(--button-outline-width) * 2))

  
}

.button.outlined:not(.white):hover {
  color: var(--accent-col);
  outline-color: var(--accent-col);
}

/* BIG - BUTTON MODEFICATOR */

.big {
  padding: 1.5rem;

  p {
    font-size: 2rem;
  }
  
  .icon {
    font-size: 2.5rem;
  }
}

/* SHORT STYLES */

.flex-col {
  display: flex;
  flex-flow: column nowrap;
}

.flex-row {
  display: flex;
  flex-flow: row nowrap;
}



.w100 {
  width: 100%;
}

.w150 {
  max-width: 120px;
}

.icon {
  font-size: 1.6rem;
}

.text-center {
  text-align: center;
}

/* MODAL STYLE */
.modal {
  position: fixed;
  z-index: 999;

  width: 50dvw;
  width: 50dvh;
  
  

  border-radius: 1rem;
  border-style: none;

  color: var(--pink);
  background-color: var(--white);
  filter: drop-shadow(0 0 3rem rgb(0,0,0, 0.4));

}

.modal::backdrop {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
}

.modal-inner {
  padding: 2.5rem;
  gap: 4rem;
}

.modal-inner div {
  gap: 1rem;

  .username {
    font-size: 2rem;
  }

  &.flex-row {
    gap: 1.5rem;
  }
}

/* Drop-Shadow Animtaion */

@keyframes card-float-in {
  from {
    z-index: 1;
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0));
  }
  to {
    z-index: 2;
    transform: scale(1.05);
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
  }
}

@keyframes card-float-out {
  from {
    z-index: 2;
    transform: scale(1.05);
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
  }
  to {
    z-index: 1;
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0));
  }
}

.dropshadow-animation {
  
  animation: card-float-out 0.15s backwards ;
  
  &:hover {
    animation: card-float-in 0.15s forwards ;
  }

}






</style>