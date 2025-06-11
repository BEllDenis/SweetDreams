<script>

export default {
  props: {
    ErrorCode: {
      type: Number, // было Type: Number
      default: 0
    },
    ErrorMessage: {
      type: String, // было Type: String
      default: "Неизвестная ошибка"
    }
  },
  data() {
    return {

    }
  },
  methods: {
    

  },
  mounted() {
    
  },
}

</script>

<template>
<main class="flex-col">

  <div class="error">

    <div class="texts">
      <!-- Код ошибки -->
      <p v-if="ErrorCode" class="error-status_code text-center">{{ ErrorCode }}</p>
      <!-- Текст ошибки -->
      <p class="error-text text-center">{{ ErrorMessage }}</p>
    </div>
    


    <!-- Кнопки -->
    <div class="buttons flex-row" >

      <a v-if="ErrorCode !== 500 && ErrorCode !== 503" class="button filled flex-row w100" @click="this.$router.push('/')">
        <i class="icon-home icon"></i>
        <p class="button_text">На главную</p>
      </a>
      
      <a v-if="ErrorCode == 401" class="button filled flex-row w100" @click="this.$router.push('/login')">
        <i class="icon-entrance icon"></i>
        <p class="button_text">Войти</p>
      </a>

      <a v-if="ErrorMessage == 'Ваша корзина пуста'" class="button filled flex-row w100" @click="this.$router.push('/catalog')">
        <i class="icon-home icon"></i>
        <p class="button_text">Перейти в каталог</p>
      </a>

    </div>
    
  </div>
</main>
</template>

<style scoped>
main {
  height: calc(100dvh - var(--header-height));

  justify-content: center;
  align-items: center;
}



.error {
  
  display: grid;
  grid-template-rows: 15rem 1fr;
  
  width: 35dvw;

  gap: 2rem;



  .texts {



    .error-status_code {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
        
      color: rgb(228, 228, 228);
        
      margin-bottom: -0.7rem;
        
      font-size: 15rem;
    }
    
    .error-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      
      font-size: 2rem;
      text-wrap: balance;
    }
  }

  .buttons {
    gap: 3rem;
  }
}






</style>