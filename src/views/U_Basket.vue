<script>
import C_IsNotAuth from '../components/С_IsNotAuth.vue';
import C_Preloader from '@/components/C_Preloader.vue';

import axios from 'axios'
// axios.defaults.baseURL = "http://localhost:3000"

import VanillaTilt from '../vanilla-tilt.js';

export default {
  components: {
    C_IsNotAuth, C_Preloader
  },
  data() {
    return {
      BasketProducts: null,

      Auth: {
        isChecked: false, // Добавляем начальное значение
        user: null
      },

      ErrorCode: null,
      ErrorMessage: '',

      ProductForDelete: null || "",

      isBasketLoading: false,
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
    async LoadBusketProducts() {
      this.isBasketLoading = true;

      try {
        let response = await axios.get('/basket_products', {
          params: { User_id: this.Auth.user._id },
          withCredentials: true
        });

        this.BasketProducts = response.data;

        this.Check_BasketIsEmpty();

        console.log("В результате запроса к продуктам из корзины был получен следующий объект:", response.data)

      } catch (error) {
        console.error("Ошибка загрузки корзины:", error);
      } finally {
        this.isBasketLoading = false;
      }

      this.initTilt();

    },
    async CheckUserAuth() {
      try {
        const res = await axios.get('/api/me', {withCredentials: true});

        this.Auth = {
          isChecked: true,
          user: res.data.user
        };
        
      } catch (error) {
        console.error('Ошибка авторизации:', error);

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
    async ChangeProductAmount(i, operation_type) {
      
      // let operation = ""

      if (operation_type == "Plus") {
        // operation = "Plus"
        this.BasketProducts[i].Amount += 1;
      } else {
        // operation = "Minus"
        this.BasketProducts[i].Amount -= 1;
      }

      await axios.patch('/basket_products/change_amount', {
        BasketProduct_id: this.BasketProducts[i]._id,
        Operation: operation_type
      }, { withCredentials: true })
    },
    DeleteClass_PreventAnimationOnStartup() {
      let ZeroAnimationObject = document.querySelector('.startup-animation-prevent')

      setTimeout(() => { ZeroAnimationObject.classList.remove('startup-animation-prevent'); }, 200);
    },
    OpenModal(id, index) {
      this.ProductForDelete = this.BasketProducts[index].ProductID;
      this.ProductForDelete.IndexInArray = index;

      const modal = document.querySelector('.modal-delete_product')
      modal.showModal()

    },
    CloseModal() {
      const modal = document.querySelector('.modal-delete_product')
      modal.close()
    },
    async DeleteBasketProduct(id) {
      const modal = document.querySelector('.modal-delete_product')
      modal.close()

      this.BasketProducts.splice(this.ProductForDelete.IndexInArray, 1);

      let response = await axios.delete('/basket_products/delete', { 
        data: { Product_id: id }, 
        withCredentials: true 
      });

      this.Check_BasketIsEmpty();

      // this.LoadProducts();

      console.log("Удаление прошло успешно: " + response.status)
    },
    Check_BasketIsEmpty() {
      if (this.BasketProducts.length == 0) {
        // this.ErrorCode = 400;
        this.ErrorMessage = "Ваша корзина пуста";
      }
    },
    async MakingOrder() {
      let response = await axios.post('/basket_products/making_order', {
        UserID: this.Auth.user._id,
        BasketProducts: this.BasketProducts,
        OrderSummaryPrice: this.OrderSummaryPrice
      });

      
    }
  },
  async mounted() {

    await this.CheckUserAuth();

    if (this.Auth.user) {
      await this.LoadBusketProducts();
      this.DeleteClass_PreventAnimationOnStartup();
    }
    this.initTilt();
  },
  computed: {
    OrderSummaryPrice() {
      return this.BasketProducts.reduce((total, item) => {
        return total + (item.ProductID.Price * item.Amount);
      }, 0);
    }
  },

  // Очистка при размонтировании компонента
  beforeUnmount() {
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

  <C_Preloader v-if="!Auth.isChecked || (Auth.user && isBasketLoading)" />

  <div v-else >
    <main v-if="Auth.user && BasketProducts?.length > 0" class="startup-animation-prevent" >
      
      <!-- Загаловок -->
      <section class="header wrapper">
        <h2>КОРЗИНА</h2>
      </section>

      <!-- вывода продуктов корзины -->
      <section v-if="BasketProducts.length > 0" class="grid wrapper">

        <!-- Пространство вывода продуктов корзины -->
        <section class="products-container">

          <div class="product_card dropshadow-animation" v-for="(product, index) in BasketProducts" :key="product._id">

            <div class="product_card-image tilt-element" :style="'background-image:' + 'url(' + product.ProductID.ImagePath + ');'"></div>
            
            <div class="product_card-text_section flex-col">
              <div class="flex-col">
                <p class="name">{{ product.ProductID.Name }}</p>
                <p class="description">{{ product.ProductID.Description }}</p>
              </div>
              <div class="flex-row">
                <p class="price">{{ product.ProductID.Price }} ₽</p>
                <p class="weight">{{ product.ProductID.Weight }} КГ</p>
              </div>
            </div>
    
            <div class="product_card-amount_section flex-col">
              <p class="amount text-center">Количество: {{ product.Amount }}</p>

              <!-- Кнопки -->
              <div class="buttons flex-col" >
                <div class="flex-row">
                  <!-- ПЛЮС -->
                  <a v-if="product.Amount < 20" class="button filled flex-row w100" @click="ChangeProductAmount(index, 'Plus')"> 
                    <i class="icon-plus icon"></i> 
                  </a>

                  <!-- МИНУС -->
                  <a v-if="product.Amount > 1" class="button filled flex-row w100" @click="ChangeProductAmount(index, 'Minus')" > 
                    <i class="icon-minus icon"></i> 
                  </a>
                </div>

                <!-- УБРАТЬ ИЗ КОРЗИНЫ -->
                <a class="button outlined flex-row" @click="OpenModal(product.ProductID._id, index)" >
                  <i class="icon-basket_shopping_minus icon"></i>
                  <p class="nav-button_text">Убрать из корзины</p>
                </a>
                
              </div>
              
            </div>

          </div>

        </section>

        <section class="making_order-container flex-col" >
          <p class="summary_price">Цена заказа: {{ OrderSummaryPrice }} ₽</p>

          <!-- Кнопка оформления -->
          <a class="button outlined white flex-row" @click="" >
            <i class="icon-order icon"></i>
            <p class="nav-button_text">Оформить заказ</p>
          </a>

        </section>
      </section>

      <p v-else class="bakset_empty-text text-center flex-col"> 
        Ваша корзина пуста
      </p>
    </main>

    <C_IsNotAuth v-else :ErrorCode="ErrorCode" :ErrorMessage="ErrorMessage"  />

  </div>

 

  <!-- Модальное окно / Поп-ап удаления продукта из корзины -->
  <dialog class="modal modal-delete_product" >
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
  animation-duration: 0s !important;
  -webkit-animation-duration: 0s !important;

}

/* ========================= MAIN ========================= */

main {
  width: 100%;
  min-height: calc(100dvh - 70px);
}

/* ========================= HEADER ========================= */

main > .header {
  margin-top: var(--page-header-margin);
  margin-bottom: var(--page-header-margin);
}

/* ========================= GRIDs ========================= */

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 5dvw;



  &:has(.product_card) {
    padding-bottom: var(--page-header-margin);
  }
}

.products-container {
  display: grid;
  grid-template-rows: repeat(auto-fit, 1fr);

  /* gap: 2rem; */
}

/* ========================= PRODUCT CARD ========================= */

.product_card {
  display: grid;
  grid-template-columns: 250px 1fr 300px;

  gap: 2rem;
  padding: 2rem;

  border-radius: calc(0.7rem + 1rem);

  background-color: var(--white);



  /* ------------- Image ------------- */
  .product_card-image {
    /* height: 100%;  */
    aspect-ratio: 1 / 1;

    border-radius: 0.7rem;

    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;

    transition: background-size, filter;
    transition-duration: 1s;
    transition-timing-function: cubic-bezier( 0, 0.13, 0, 0.99 );


    &:hover {
      background-size: auto 110%;
      filter: saturate(115%)
    }
  }
  
  

  /* ------------- Text Section ------------- */
  .product_card-text_section {

    div {
      

      &.flex-col {
        gap: 1rem;

        flex-grow: 1;

        .name {
          font-size: 3rem;
        }
      }

      &.flex-row {
        align-items: end;
        gap: 3rem;


        .price, .weight {
          font-size: 2rem;
        }
      }

    }
    
  }

  /* ------------- Amount Section ------------- */
  .product_card-amount_section {
    justify-content: center;
    gap: 2rem;
    /* width: fit-content; */

    .amount {
      font-size: 2rem;
    }

    .buttons {
      gap: 1.5rem;
      
      div {
        gap: 1.5rem;
      }
    }
  }

  
}

/* ========================= MAKING ORDER CONTAINER ========================= */

.making_order-container {
  position: sticky;
  top: calc(70px + 3rem);

  height: fit-content;

  gap: 2rem;
  padding: 3rem;

  background-color: var(--pink);

  border-radius: 1.7rem;



  .summary_price {
    color: var(--white);
  }
}

.bakset_empty-text {
  font-size: 3rem;
  color: var(--gray);

  text-wrap: balance;
}


</style>
