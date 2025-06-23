<script>
import C_IsNotAuth from '@/components/С_IsNotAuth.vue';
import C_Preloader from '@/components/C_Preloader.vue';

import axios from 'axios'


import VanillaTilt from '../vanilla-tilt.js';

export default {
  components: {
    C_IsNotAuth, C_Preloader
  },
  data() {
    return {
      Products: null,

      Categories: [
        {
          name: "Торты",
          value: "торты"
        },
        {
          name: "Эклеры",
          value: "эклеры"
        },
        {
          name: "Круассаны",
          value: "круассаны"
        },
        {
          name: "Пирожные",
          value: "пирожные"
        }
      ],
      SelectedCategories: ["торты", "эклеры", "круассаны", "пирожные"],
      
      TypesOfSort: [
        {
          name: "(Отсутствует)",
          value: "",
          initialValue: true
        },
        {
          name: "По новизне",
          value: "New"
        },
        {
          name: "По цене (возростание)",
          value: "PriceIncrease"
        },
        {
          name: "По цене (убывание)",
          value: "PriceDecrease"
        },
      ],
      SelectedTypeOfSort: '',

      Auth: {
        isChecked: false, // Добавляем начальное значение
        user: null
      },

      ErrorCode: null,
      ErrorMessage: '',

      ProductForDelete: null || "",
    };
  },
  methods: {
    initTilt() {
      // Используем nextTick для гарантии рендеринга DOM
      this.$nextTick(() => {
        
        // Инициализация для всех элементов с классом tilt-element
        const elements = document.querySelectorAll(".tilt-element");
        if (elements.length > 0) {
          VanillaTilt.init(elements, {
            reverse: true,
            max: 10,
            perspective: 2000,
            speed: 2000,
            transition: true,
            scale: 1.05,
            glare: false,
            "max-glare": 0.10,
          });
        }

        // Инициализация для всех обратных элементов с классом tilt-element-reversed
        const elements_reversed = document.querySelectorAll(".tilt-element-reversed");
        if (elements_reversed.length > 0) {
          VanillaTilt.init(elements_reversed, {
            reverse: false,
            max: 10,
            perspective: 2500,
            speed: 2000,
            transition: true,
            scale: 1.05,
            glare: false,
            "max-glare": 0.10,
          });
        }
      });

    },
    async LoadProducts() {
      
      let response = await axios.get('/catalog', {
        params: {
          SelectedCategories: this.SelectedCategories,
          SelectedTypeOfSort: this.SelectedTypeOfSort
        }
      }, {withCredentials:true});

      this.Products = response.data;

      this.$nextTick(() => {
        this.AddClass_PreventAnimationOnStartup();
        this.DeleteClass_PreventAnimationOnStartup();
      });

      this.initTilt();

    },
    async CheckUserAuth() {
      try {
        const res = await axios.get('/me', { withCredentials: true });

        this.Auth = {
          isChecked: true,
          user: res.data.user
        };
        
      } catch (error) {
        console.error('Ошибка авторизациии:', error);

        this.Auth = { 
          isChecked: true, 
          user: null 
        };
      
        // Исправленная проверка ошибок
        if (error.response) {
          // Сервер ответил с 4xx/5xx статусом
          this.ErrorCode = error.response.status;
          this.ErrorMessage = error.response.data?.message || 'Ошибка сервера';

        } else if (error.request) {
          // Запрос был отправлен, но ответа нет
          this.ErrorCode = 503;
          this.ErrorMessage = 'Не удалось подключиться к серверу';

        } else {
          // Ошибка в настройке запроса
          this.ErrorCode = 500;
          this.ErrorMessage = 'Ошибка при отправке запроса';
        }
      
        console.log('Установлены коды ошибок:', this.ErrorCode, this.ErrorMessage);
      }
    },
    async AddToBusket(id, index) {

      this.Products[index].InBasket = true;
      
      await axios.post('/basket_products', {
        Product_id: id,
        User_id: this.Auth.user._id
      }, { withCredentials: true });

      // this.LoadProducts();
    },
    DeleteClass_PreventAnimationOnStartup() {
      // Получаем все элементы с классом startup-animation-prevent
      let ZeroAnimationObject = document.querySelector('.startup-animation-prevent');

      setTimeout(() => { 
        // Перебираем все найденные элементы
        ZeroAnimationObject.classList.remove('startup-animation-prevent'); 
        ZeroAnimationObject.classList.add('startup-animation-prevented'); 
      }, 250);

    },
    AddClass_PreventAnimationOnStartup() {
      // Получаем все элементы с классом startup-animation-prevent
      let ZeroAnimationObject = document.querySelector('.startup-animation-prevented');

       
      // Перебираем все найденные элементы
      ZeroAnimationObject.classList.remove('startup-animation-prevented'); 
      ZeroAnimationObject.classList.add('startup-animation-prevent'); 
      
      

    },
    OpenModal(id, index) {
      this.ProductForDelete = this.Products[index]

      const modal = document.querySelector('.modal')
      modal.showModal()


    },
    CloseModal() {
      const modal = document.querySelector('.modal')
      modal.close()
    },
    async DeleteBasketProduct(id) {
      const modal = document.querySelector('.modal')
      modal.close()

      this.ProductForDelete.InBasket = false;

      let response = await axios.delete('/basket_products/delete', { 
        data: { Product_id: id }, 
        withCredentials: true 
      });

      // this.LoadProducts();

      console.log("Удаление прошло успешно: " + response.status)
    },
    
  },
  async mounted() {

    await this.CheckUserAuth();

    await this.LoadProducts();

    this.DeleteClass_PreventAnimationOnStartup();

    this.initTilt();

    // if (this.Auth.user) { // Добавьте проверку
      
    // }



  },
  // Очистка при размонтировании компонента
  beforeUnmount() {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.debouncedFixWidth);
    }

    const elements = document.querySelectorAll(".tilt-element");
    elements.forEach(element => {
      if (element.vanillaTilt) {
        element.vanillaTilt.destroy();
      }
    });

    
  }
}
</script>



<template>
  <div>
    <main v-if="Products" class="startup-animation-prevent">
      
      <!-- Загаловок -->
      <section class="header wrapper">
        <h2>КАТАЛОГ</h2>
      </section>

      <!-- Пространство фильтра и вывода продуктов -->
      <section class="grid wrapper">

        <!-- Пространство фильтра -->
        <section class="filter-container flex-col tilt-element-reversed">

          <!-- Заголовок пространства -->
          <div class="header flex-row">
            <i class="icon-filter icon"></i>
            <p class="fs-2rem"> ФИЛЬТРЫ </p>
          </div>

          <!-- Разделитель -->
          <!-- <div class="separate-line"></div> -->

          <!-- Фильтрация по категориям -->
          <div class="filter-categories flex-col">

            <p class="fs-1-7rem"> Категории: </p>

            <div class="categories flex-col">

              <label class="flex-row" v-for="(category, index) in Categories" > 
                <input class="check-box" type="checkbox" checked :value="category.value" v-model="SelectedCategories" @change="LoadProducts()"> {{ category.name }} 
              </label>

            </div>
          </div>


          <!-- Фильтрация по актуальности -->
          <div class="filter-sort flex-col">

            <p class="fs-1-7rem"> Сортировка: </p>

            <div class="sort flex-col">

              <label class="flex-row" v-for="(TypeOfSort, index) in TypesOfSort"> 
                <input class="radio-button" type="radio" name="sort" :value="TypeOfSort.value" :checked="TypeOfSort.initialValue" v-model="SelectedTypeOfSort" @change="LoadProducts()"> {{TypeOfSort.name}} 
              </label>

            </div>

          </div>

        </section>

        <!-- Пространство вывода продуктов -->
        <section class="products-container">

          <div class="product_card dropshadow-animation flex-col" v-for="(product, index) in Products" :key="product._id">

            <!-- 1 Половина карточки -->
            <div class="space_between-contaier flex-col">

              <div class="product_card-image" :style="'background-image:' + 'url(' + product.ImagePath + ');'"></div>

              <div class="product_card-text_section flex-col">
                <p class="name">{{ product.Name }}</p>
                <p class="description">{{ product.Description }}</p>
              </div>
            </div>

            <!-- 2 Половина карточки -->
            <div class="space_between-contaier flex-col">

              <div class="product_card-text_section flex-row">
                <p class="price">{{ product.Price }} ₽</p>
                <p class="weight">{{ product.Weight }} КГ</p>
              </div>

              <a v-if="(Auth.user && !product.InBasket)" class="button filled flex-row" @click="AddToBusket(product._id, index)" >
                <i class="icon-shopping_busket_plus icon"></i>
                <p class="nav-button_text">В корзину</p>
              </a>
              <a v-if="product.InBasket" class="button outlined flex-row" @click="OpenModal(product._id, index)" >
                <i class="icon-basket_shopping_minus icon"></i>
                <div class="text-wrapper flex-row"> <!-- Новый контейнер -->
                  <p class="nav-button_text" >Убрать из корзины</p>
                </div>
              </a>
            </div>



          </div>

        </section>
      </section>
    </main>

    <C_Preloader v-else />
    <C_IsNotAuth class="d-none" :ErrorCode="ErrorCode" :ErrorMessage="ErrorMessage"  />
    
  </div>

  <!-- Модальное окно / Поп-ап удаления продукта из корзины -->
  <dialog class="modal " >
    <div class="modal-inner flex-col">
      <!-- Текст -->
      <div class="flex-col">
        <p class="text-center">Вы желаете убрать</p>
        <p class="username text-center">{{ ProductForDelete.Name }}</p>
        <p class="text-center">из вашей корзины?</p>
      </div>
      
      <!-- Кнопки -->
      <div class="flex-row">
        <button type="submit" class="button filled flex-row w100" @click="DeleteBasketProduct(ProductForDelete._id)" >
          <i class="icon-basket_shopping_minus icon"></i>
          <p class="button_text">Убрать</p>
        </button>
        <button class="button outlined flex-row w100" @click="CloseModal" >
          <i class="icon-close icon"></i>
          <p class="button_text">Закрыть</p>
        </button>
      </div>
    </div>
  </dialog>
  
</template>



<style scoped>

.startup-animation-prevent * {
  -webkit-animation-duration: 0s !important;
  animation-duration: 0s !important;

}

/* ========================= MAIN ========================= */

main {
  width: 100%;
  min-height: calc(100dvh - 70px);
}

/* ========================= HEADER ========================= */

main > .header {
  margin-top: 60px;
  margin-bottom: 60px;
}

/* ========================= GRID ========================= */

.grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
}

/* ========================= FILTER ========================= */

/* ------------- filter ------------- */

.filter-container {
  position: sticky;
  top: calc(70px + 3rem);

  height: fit-content;

  gap: 2rem;
  padding: 2rem;
  margin-bottom: 3rem;

  border-radius: 0.7rem;

  color: var(--white);
  background-color: var(--pink);
}

.filter-container .header{
  align-items: center;
  gap: 0.7rem;
}

.filter-container .icon-filter {
  font-size: 2rem;
}

.separate-line {
  height: 3px;
  width: 100%;
}

/* ------------- filter category ------------- */

.filter-categories, .filter-sort {
  gap: 1.5rem;
}


.categories, .sort {
  gap: 0.5rem
}

/* ------------- filter category - checkbox ------------- */

label {
  align-items: center;
  font-size: 1.5rem;
}

.check-box, .radio-button {
  appearance: none;

  margin-right: 0.7rem;
}

.check-box {
  position: relative;
  

  width: 1.5rem;
  height: 1.5rem;

  border: 3px solid var(--white);
  border-radius: 25%;
}

.check-box::before {
  content: '';
  position: absolute;

  width: 1.5rem;
  height: 1.5rem;

  border-radius: 25%;

  background-color: transparent;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.check-box:checked::before {
  background-color: var(--white);
}

/* ------------- sort - radio-button ------------- */

.radio-button {
  position: relative;
  appearance: none;

  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;

  margin-right: 0.7rem;

  border: 3px solid var(--white);
  border-radius: 50%;
}

.radio-button::before {
  content: '';
  position: absolute;

  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;

  border-radius: 50%;
  background-color: transparent;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio-button:checked::before {
  background-color: var(--white);
}


/* ========================= PRODUCTS ========================= */

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-auto-rows: auto;

  /* gap: 3rem; */

  padding: 0 0rem 3rem 3rem;
}


.product_card {
  justify-content: space-between;
  gap: 1.5rem;
  padding: 2rem;

  border-radius: 2rem;

  background-color: var(--white);

  transition: height 0.2s;
  /* aspect-ratio: 1 / 1.7; */
}

.space_between-contaier {
  gap: 1rem;
}

/* ------------- Image ------------- */

.product_card-image {
  aspect-ratio: 1 / 1;

  border-radius: 0.7rem;

  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center center;

  transition: background-size, filter;
  transition-duration: 1s;
  transition-timing-function: cubic-bezier( 0, 0.13, 0, 0.99 );
}

.product_card-image:hover {
  background-size: auto 110%;
  filter: saturate(115%)
}

/* ------------- Text Section ------------- */

.product_card-text_section.flex-col {
  gap: 1rem;

  height: fit-content;
}

.name {
  font-size: 1.9rem;
}

.description {
  font-size: 1.1rem;
}

.price, .weight {
  font-size: 1.6rem;
}

.product_card-text_section.flex-row {
  justify-content: space-between;
}





</style>
