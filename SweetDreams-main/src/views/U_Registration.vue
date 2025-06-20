<script>
import axios from 'axios'
// axios.defaults.baseURL = "http://localhost:3000"

export default {
  data() {
    return {
      ShowPassword: false,

      NameIsValid: false,
      SurnameIsValid: false,
      EmailIsValid: false,
      TelisValid: false,
      PasswordIsValid: false,

      ModalText: null,
      ModalButton: null,

      IsRegistrationLoading: false,
    }

    
  },
  methods: {
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

        return;
      }

      // NAME
      // Определения типа поля ввода 
      if (Input.id == "Input_Name") {
        // Регулярное выражение для общей валидации поля 
        const Regex = /^[A-Za-zА-Яа-яЁё]{2,15}$/;

        // Регулярное выражение для определения типа tooltip 
        const hasNumberOrSpecChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/.test(Input.value);

        // Установка текста для Label
        if (hasNumberOrSpecChar) {
          Label.innerHTML = "Недопустимо содержание цифр или специальных символов"
        } else if (Input.value.length < 2) {
          Label.innerHTML = "Минимум 2 символа"
        } else if (Input.value.length > 15) {
          Label.innerHTML = "Максимум 15 символов"
        }


        // Вызов функции общей валидации.
        // Передаем поле ввода, выражение общей проверки, и контейнер tooltip'а
        this.NameIsValid = this.InputValidation(Input, Regex, LabelContainer); 

        if (this.NameIsValid == false && CallModal) {
          console.log("вызвано мудальное окно");
        }

      }
      
      // SURNAME
      else if (Input.id == "Input_Surname") {
        const Regex = /^[A-Za-zА-Яа-яЁё]{2,15}$/;

        const hasNumberOrSpecChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/.test(Input.value);

        if (hasNumberOrSpecChar) {
          Label.innerHTML = "Недопустимо содержание цифр или специальных символов"
        } else if (Input.value.length < 2) {
          Label.innerHTML = "Минимум 2 символа"
        } else if (Input.value.length > 15) {
          Label.innerHTML = "Максимум 15 символов"
        }

        this.SurnameIsValid = this.InputValidation(Input, Regex, LabelContainer);

      }
      // EMAIL
      else if (Input.id == "Input_Email") {
        const Regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const hasRussianLetters = /[а-яА-Я]/.test(Input.value);
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
      // TELEPHONE
      else if (Input.id == "Input_Tel") {
        const Regex = /^\+\d{6,19}$/;

        const hasLetterOrSpecChar = /[`!@#$%^&*()_\-=\[\]{};':"\\|,.<>\/?~а-яА-Яa-zA-Z]/.test(Input.value);

        if (hasLetterOrSpecChar) {
          Label.innerHTML = "Недопустимы буквы и специальные символы кроме +";
        } else if (!Input.value.startsWith("+")) {
          Label.innerHTML = "Номер должен начинаться с +";
        } else if (Input.value.length < 7) {
          Label.innerHTML = "Минимум 6 цифр";
        }

        this.TelisValid = this.InputValidation(Input, Regex, LabelContainer);

      }
      // PASSWORD
      else if (Input.id == "Input_Password") {
        const Regex = /^[A-Za-z0-9!@#$%^&*_=+-]{8,20}$/;
        
        const hasRussianLetters = /[а-яА-Я]/.test(Input.value);
        
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
      if (this.NameIsValid && this.SurnameIsValid && this.EmailIsValid && this.TelisValid && this.PasswordIsValid) {

        // alert('Запрос на регистрацию отправлен')
        this.IsRegistrationLoading = true;

        try {
          let response = await axios.post('/registration', {
            Name: document.getElementById('Input_Name').value,
            Surname: document.getElementById('Input_Surname').value,
            Email: document.getElementById('Input_Email').value,
            Tel: document.getElementById('Input_Tel').value,
            Password: document.getElementById('Input_Password').value,
          })

          this.IsRegistrationLoading = false;

          // Успешный ответ (2xx)
          console.log('Статус:', response.status);
          console.log('Сообщение:', response.data.message);
      
          if (response.status === 201) {
            // alert('Регистрация успешна!');
            
            this.OpenModal(response);

            // this.$router.push('/login'); // Переходим на страницу Входа в аккаунт
          }

        } catch (error) {
          // Ошибка (4xx/5xx)
          if (error.response) {
            console.log('Статус ошибки:', error.response.status);
            console.log('Сообщение об ошибке:', error.response.data.message);

            if (error.response.status === 400 || error.response.status === 500) {
              // alert(`Ошибка: ${error.response.data.message}`);
              this.OpenModal(error.response);
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

  
  
  <form class="flex-col" novalidate autocomplete="off" @submit.prevent="InputFinalValidation">

    <h1 class="text-center">Регистрация</h1>

    <!-- Имя -->
    <div class="input-container">
      <div class="label-container flex-row hidden">
        <i class="icon-eye_alert icon"></i>
        <label for="Input_Name" class=""></label>
      </div>
      
      <input id="Input_Name"  type="text" required placeholder="Имя" spellcheck="false" data-lpignore="true" 
      data-form-type="other" title=""  @input="Input_InputEvent" >
    </div>
    

    <!-- Фамилия -->
    <div class="input-container">
      <div class="label-container flex-row hidden" >
        <i class="icon-eye_alert icon"></i>
        <label for="Input_Surname" class=""></label>
      </div>

      <input id="Input_Surname" type="text" required placeholder="Фамилия" spellcheck="false" data-lpignore="true" 
      title="" @input="Input_InputEvent" >
    </div>
    

    <!-- Почта -->
    <div class="input-container">
      <div class="label-container flex-row hidden" >
        <i class="icon-eye_alert icon"></i>
        <label for="Input_Email" class=""></label>
      </div>

      <input id="Input_Email" type="email" required placeholder="Почта" spellcheck="false" data-lpignore="true" 
      title="" @input="Input_InputEvent" >
    </div>
    

    <!-- Номер телефона -->
    <div class="input-container">
      <div class="label-container flex-row hidden" >
        <i class="icon-eye_alert icon"></i>
        <label for="Input_Tel" class="" >  </label>
      </div>

      <input id="Input_Tel" type="Tel" required placeholder="Телефон" spellcheck="false" data-lpignore="true" 
      title="" @input="Input_InputEvent">
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
    

    <button type="submit" class="button filled flex-row"
    :class="{'disabled': !this.NameIsValid || !this.SurnameIsValid || !this.EmailIsValid || !this.TelisValid || !this.PasswordIsValid}">

      <i v-if="!IsRegistrationLoading" class="icon-user_add icon"></i>
      <p v-if="!IsRegistrationLoading" class="button_text">Создать аккаунт</p>

      <span v-if="IsRegistrationLoading" class="loader"></span>
    </button>

  </form>

  <div class="login_route flex-row" >
    <p>Уже есть аккаунт?</p> 
    <a href="" class="fs-1-5rem" @click="this.$router.push('/login')">Войти</a>
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
        <button v-else class="button outlined flex-row w100" @click="this.$router.push('/login')">
          <p class="button_text">Войти</p>
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

  .button {

    &.disabled {
      background-color: var(--gray);
    }
  }


}

.input-container {
  position: relative;
}

/* INPUT STYLES */


input {
  --gray: rgb(200,200,200);
  --height: 4rem;
  --FS: 1.7rem;

  position: relative;

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

.login_route {
  gap: 1rem;
}

.login_route a:hover {
  color: var(--accent-col);
  transform: scale(1.1);
}


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