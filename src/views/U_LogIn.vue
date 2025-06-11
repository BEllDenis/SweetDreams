<script>
import axios from 'axios'
// axios.defaults.baseURL = "http://localhost:3000"

export default {
  inject: ['setUser', 'checkAuth'],
  data() {
    return {
      ShowPassword: false,

      EmailIsValid: false,
      PasswordIsValid: false,

      ModalText: null,
      ModalButton: null,

      IsLoginLoading: false,
    }
  },
  methods: {
    ToCatalog() {
      this.$router.push({ name: "catalog" });
    },
    Input_InputEvent(event) {
      // Регистрация поля ввода
      const Input = event.target;

      const Label = Input.labels[0];
      const LabelContainer = Label.closest('.label-container');

      console.log("Полученный элемент:"); console.log(Input);


      // Проверка на пустоту 
      if (Input.value == "" || Input.value == null) {
        Input.classList.remove('invalid');
        Input.classList.remove('valid');

        LabelContainer.classList.add('hidden');

        console.log("Поле ввода пусто > Стили убраны.");

        return
      }


      // Определения типа поля ввода 
      // EMAIL
      if (Input.id == "Input_Email") {
        const Regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const hasRussianLetters = /[a-яА-Я]/.test(Input.value);
        const hasWhitespace = /\s/.test(Input.value);
        const hasDoubleDots = /\.{2,}/.test(Input.value);
        const domainValid = /\.[a-zA-Z]{2,}$/.test(Input.value);

        if (hasRussianLetters) {
          Label.innerHTML = "Допустимо содержание только латинских символов"
        } else if (hasWhitespace) {
          Label.innerHTML = "Уберите пробелы в email";
        } else if (hasDoubleDots) {
          Label.innerHTML = "Недопустим двойной символ точки";
        } else if (!Input.value.includes('@')) {
          Label.innerHTML = "Добавьте @ в email адрес";
        } else if (!domainValid) {
          Label.innerHTML = "Некорректный домен (пример: .com .ru)";
        }

        this.EmailIsValid = this.InputValidation(Input, Regex, LabelContainer);

      }
      else if (Input.id == "Input_Password") {
        const Regex = /^[A-Za-z0-9!@#$%^&*_=+-]{8,20}$/;

        const hasRussianLetters = /[a-яА-Я]/.test(Input.value);
        
        if (hasRussianLetters) {
          Label.innerHTML = "Допустимо содержание только латинских символов"
        } else if (Input.value.length < 8) {
          Label.innerHTML = "Минимум 8 символов";
        } else if (Input.value.length > 20) {
          Label.innerHTML = "Максимум 20 символов";
        }

        this.PasswordIsValid = this.InputValidation(Input, Regex, LabelContainer);
      }

      console.log("Валидация поля вызвана.");

    },
    InputValidation(Input, Regex, LabelContainer) {
      console.log("Валидация поля начата.");

      const isValid = Regex.test(Input.value)

      if (isValid) {
        Input.classList.remove('invalid');
        Input.classList.add('valid');

        LabelContainer.classList.add('hidden');

        return true;
      }
      else if (!isValid) {
        Input.classList.remove('valid');
        Input.classList.add('invalid');

        LabelContainer.classList.remove('hidden');
        
        return false;
      }

    },
    async InputFinalValidation() {
      if (this.EmailIsValid && this.PasswordIsValid) {

        // alert('Запрос на авторизацию отправлен')

        try {
          this.IsLoginLoading = true;

          let response = await axios.post('/login', {
            Email: document.getElementById('Input_Email').value,
            Password: document.getElementById('Input_Password').value,
          }, 
          {
              withCredentials: true // Разрешаем передачу cookie 
          })

          this.IsLoginLoading = false;

          if (response.status === 200) {
            // alert('Авторизация успешна!');
            await this.checkAuth(); // Обновляем данные пользователя

            this.OpenModal(response)

            // Успешный ответ (2xx)
            console.log('Статус:', response.status);
            console.log('Сообщение:', response.data.message);
          }

          console.log(response.data)

        } catch (error) {
          // Ошибка (4xx/5xx)
          if (error.response) {
            console.log('Статус ошибки:', error.response.status);
            console.log('Сообщение об ошибке:', error.response.data.message);

            if (error.response.status === 400 || error.response.status === 500) {
              // alert(`Ошибка: ${error.response.data.message}`);
              this.OpenModal(response)
            }
            
          } else {
            console.error('Ошибка сети:', error.message);
          }
        }   
      }
    },
    OpenModal(response) {
      this.ModalText = response.data.message;
      this.ModalButton = response.data.type;

      document.querySelector(".modal").showModal();
    },
    CloseModal() {
      document.querySelector(".modal").close();
    }
  },
  mounted() {

  }
}
</script>

<template>
<main class="flex-col">

  
  
  <form class="container flex-col" novalidate autocomplete="off" @submit.prevent="InputFinalValidation">

    <h1 class="text-center">Вход</h1>

    <!-- Почта -->
    <div class="input-container">
      <div class="label-container flex-row hidden" >
        <i class="icon-eye_alert icon"></i>
        <label for="Input_Email" class=""></label>
      </div>

      <input id="Input_Email" type="email" required placeholder="Почта" spellcheck="false" data-lpignore="true" 
      title="" @input="Input_InputEvent" >
    </div>

    <!-- Пароль -->
    <div class="input-container">
      <div class="label-container flex-row hidden" >
        <i class="icon-eye_alert icon"></i>
        <label for="Input_Password" class="" >  </label>
      </div>

      <input id="Input_Password" type="password" required placeholder="Пароль" spellcheck="false" data-lpignore="true" 
      title="" @input="Input_InputEvent" >
      <!-- <i class="icon-eye icon"></i> -->
    </div>
    

    <button type="submit" class="button filled flex-row">
      <i v-if="!IsLoginLoading" class="icon-entrance icon"></i>
      <p v-if="!IsLoginLoading" class="button_text">Войти</p>

      <span v-if="IsLoginLoading" class="loader"></span>
    </button>

  </form>

  <div class="registration_route flex-row" >
    <p>Нет аккаунта?</p> 
    <a href="" class="fs-1-5rem" @click="this.$router.push('/registration')" >Регистрация</a>
  </div>
  


</main>


  <!-- Модальное окно / Поп-ап удаления продукта из корзины -->
  <dialog class="modal" >
    <div class="modal-inner flex-col">
      <!-- Текст -->
      <div class="flex-col">
        <p class="text-center"> {{ ModalText }} </p>
      </div>
      
      <!-- Кнопки -->
      <div class="flex-row">
        <button v-if="ModalButton == 'error'" class="button outlined flex-row w100" @click="CloseModal">
          <p class="button_text">Хорошо</p>
        </button>
        <button v-else class="button outlined flex-row w100" @click="this.$router.push('/')">
          <p class="button_text">На главную</p>
        </button>
      </div>
    </div>
  </dialog>

</template>

<style scoped>

main {
  height: calc(100dvh - 70px);

  justify-content: center;
  align-items: center;

  gap: 2rem;

  * {
    font-family: 'Cygre';
  }
}

h1 {
  background-color: white;

  font-size: 3rem;
}

form {
  --padding: 2rem;

  display: flex;


  gap: 2rem;


}

.input-container {
  position: relative;
}

/* INPUT STYLES */


input {
  --gray: rgb(200,200,200);
  --height: 4rem;
  --FS: 1.7rem;
  --invalid: rgb(255, 217, 0);

  width: 100%;
  height: var(--height);

  padding: 1.5rem 1.5rem 1.5rem 1rem;

  outline: none;

  color: var(--gray);  
  border: 3px solid var(--gray);
  border-radius: 1rem;

  font-family: 'Cygre';
  font-size: var(--FS);

  transition: border-color, color;
  transition-duration: 0.2s;

  &::selection {
    color: white;
    background-color: var(--gray);
    transition-duration: inherit;
  }

  &::placeholder {
    margin: 0;
    padding: 0;
    color: var(--gray);
    transition-duration: inherit;
  }

}



input.default {
  border-color: var(--gray);
  color: var(--gray);

  &::placeholder {
    color: var(--gray);
  }

  &::selection {
    background-color: var(--gray);
  }
}


input.valid {
  border-color: var(--pink);
  color: var(--pink);

  &::placeholder {
    color: var(--pink);
  }

  &::selection {
    background-color: var(--pink);
  }
}

input.invalid {
  border-color: var(--invalid);
  border-top-left-radius: 0px;
  color: var(--invalid);

  &::placeholder {
    color: var(--invalid);
  }

  &::selection {
    background-color: var(--invalid);
    
  }
}


input[type="password"]::-ms-reveal {
  display: none;
}

input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-contacts-auto-fill-button {
  display: none !important;
}

.label-container {
  position: absolute;

  align-items: center;
  z-index: 2;
  top: 0;
  left: 0;
  translate: 0% -100%;
  width: 200%;

  gap: 0.5rem;

  color: var(--invalid);
  text-wrap: pretty;

}

.label-container, .label-contain i {
  opacity: 100;
  transition: opacity 0.2s;
}

.label-container.hidden, .label-container i.hidden {
  opacity: 0;
}

.registration_route.flex-row {
  gap: 1rem;
}

.registration_route a:hover {
  color: var(--accent-col);
  transform: scale(1.1);
}

/* CSS LOADER */

.loader {
  width: 1.5rem;
  height: 1.5rem;
  border: 5px solid #FFF;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
} 

</style>