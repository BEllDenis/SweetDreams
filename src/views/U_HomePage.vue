<script>
import axios from 'axios'

import VanillaTilt from 'vanilla-tilt';

export default {
  data() {
    return {
      NewProducts: [],
      UserComments: []
    }
  },
  methods: {
    ToCatalog() {
      this.$router.push({ name: "catalog" });
    },
    initTilt() {
      // Используем nextTick для гарантии рендеринга DOM
      this.$nextTick(() => {
        // Инициализация для всех элементов с классом tilt-element
        const elements = document.querySelectorAll(".tilt-element");
        if (elements.length > 0) {
          VanillaTilt.init(elements, {
            reverse: true,
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
    async LoadNewProducts() {
      let response = await axios.get('/new_products', {});

      this.NewProducts = response.data;
      
      this.initTilt();

    },
    async LoadUserComments() {
      let response = await axios.get('/user_comments', {});

      this.UserComments = response.data;
      
      this.initTilt();

    }
  },
  mounted() {
    this.LoadNewProducts();
    this.LoadUserComments();
    
    this.initTilt();
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
<main>


<!-- BANNER SECTION -->
<section class="banner">

  <div class="banner-image flex-col" >

    <div class="banner-container wrapper flex-col">

      <h1 class="banner-header">Делаем ваши мечты слаще</h1>
      
      <p сlass="banner-subheader">Создавая уникальные сладости из лучших ингредиентов, которые тают во рту и дарят незабываемое наслаждение</p>
      
      <a class="button filled big banner-button flex-row" @click="ToCatalog()">
        <i class="icon-catalog icon"></i>
        <p class="nav-button_text">НАЙТИ СВОЮ СЛАДОСТЬ</p>
      </a>

    </div>

  </div>

</section>

<!-- OUR FEATURES SECTION -->
<section class="our_features wrapper flex-col">
  <h2>Почему выбирают нас?</h2>

  <div class="feature_cards">

    <div class="feature_card flex-col tilt-element">

      <div class="feature_card-image">
        <img src="../assets/images/LandingPage/Сonfectioner.png" alt="" loading="lazy">
      </div>

      <div class="feature_card-text_section flex-col">
        <h3 class="feature_card-header">Качество превыше всего</h3>
        <p class="feature_card-text">Мы используем только натуральные ингредиенты для создания наших тортов, пирожных, кексов и других угощений</p>
      </div>
      
    </div>

    <div class="feature_card flex-col tilt-element">
      <div class="feature_card-image">
        <img src="../assets/images/LandingPage/RichAssortment.png" alt="">
      </div>

      <div class="feature_card-text_section flex-col">
        <h3 class="feature_card-header">Богатый ассортимент</h3>
        <p class="feature_card-text">В нашем каталоге представлен широкий выбор сладостей на любой вкус — от классических тортов до изысканных макарунов</p>
      </div>
      
    </div>

    <div class="feature_card flex-col tilt-element">
      <div class="feature_card-image">
        <img src="../assets/images/LandingPage/OrderConvenience.jpeg" alt="">
      </div>

      <div class="feature_card-text_section flex-col">
        <h3 class="feature_card-header">Удобство заказа</h3>
        <p class="feature_card-text">Сделайте свой заказ прямо со своего устройства — наш сайт адаптирован для работы на многих платформах, а простой интерфейс поможет быстро найти то, что вам нужно</p>
      </div>
      
    </div>

  </div>
  

</section>

<!-- NEW PRODUCTS SECTION -->
<section class="new_products wrapper flex-col">
  <h2>Наши новинки</h2>

  <div class="new_products_cards">

    <div class="new_products_card flex-col tilt-element" v-for="(NewPoduct, index) in NewProducts">
      <div class="new_products_card-image">
        <img :src="NewPoduct.ImagePath" alt="" loading="lazy">
      </div>

      <div class="new_products_card-text_section flex-col">
        <h3 class="new_products_card-header">{{NewPoduct.Name}}</h3>
        <p class="new_products_card-text">{{ NewPoduct.Price }} Р</p>
      </div>
    </div>


  </div>
  
  <a class="button filled big flex-row" @click="ToCatalog()">  
    <i class="icon-catalog icon"></i>
    <p class="nav-button_text">ПЕРЕЙТИ В КАТАЛОГ</p>
  </a>

</section>



</main>
</template>

<style scoped>

section:not(:first-of-type) {
  margin-top: 60px;
  margin-bottom: 60px;
}

/* ========================= MAIN ========================= */

/* Banner */
.banner {
  color: var(--white);
}

.banner-image {
  justify-content: center;
  width: 100%;
  height: calc(100dvh - 70px);

  background: 
    linear-gradient(90deg, rgb(0,0,0) 0%, rgb(0,0,0, 0.0) 70%),
    url(../assets/images/LandingPage/MainPhoto.png);
  background-size: cover;
  background-position: center center;
}

.banner-container {
  justify-content: space-between;

  gap: 2.5rem;
  
  width: 50dvw;
}

.banner-subheader {
  text-wrap: balance;
}

/* ------------- Our Features ------------- */
.our_features, .new_products, .users_comments {
  gap: 60px;
}

.feature_cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 3rem;

  height: 640px;
}

.feature_card, .new_products_card {
  border-radius: 2rem;

  overflow: hidden;

  /* transition: scale 0.3s cubic-bezier( 0.3, 0, 0.49, 1 ) ; */
}

.feature_card-image {
  width: 100%;
  height: 55%;

  overflow: hidden;
}

.feature_card-text_section, 
.new_products_card-text_section {
  justify-content: space-around;
  flex-grow: 1;
  
  text-align: center;
  text-wrap: balance;

  padding: 1.5rem;

  color: var(--white);
  background-color: var(--pink);
}

/* ------------- New products ------------- */

.new_products_cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 3rem;

  overflow: visible;
  height: 400px;
}

.new_products_card-image {
  width: 100%;
  height: 60%;

  overflow: hidden;
}

.feature_card-image img,
.new_products_card-image img {
  width: 105%;
  height: 105%;
  
  object-fit: cover;
  background-position: center center;
}

/* ------------- New products ------------- */

.users_comments_cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 3rem;

  width: auto;
  height: 350px;
}

.user_comment_card {
  justify-content: space-around;
  align-items: center;

  padding: 2rem;
  border-radius: 2rem;

  color: var(--white);
  background-color: var(--pink);
}

.user_comment_card .user {
  justify-content: center;
  align-items: center;
  width: 100%;

  gap: 2rem;
}

.user_comment-icon {
  font-size: 5rem;
}

.user_comment_card .username {
  font-size: 2.25rem;
}

.user_comment_card .user_comment {
  text-align: center;
  text-wrap: pretty;
}



</style>