<script>

</script>

<template>
  <main class="flex-row wrapper">
    
    <div class="left-side flex-col">

      <div class="history flex-col">
        <h2>Наша история</h2>
        <p> Основанная в 2023 году, Sweet Dreams начала свой путь с маленькой домашней пекарни. Сегодня мы превратились в любимую кондитерскую города, где каждый торт, пирожное или круассан — это результат кропотливого труда, творчества и любви к своему делу. Наша миссия — дарить радость через идеальное сочетание вкуса и эстетики.</p>
      </div>

      

      <div class="contact-info flex-col">
        <h2>Контакты</h2>
        <p>Адрес: г. Амурск, ул. Ленина, д. 15
          <br>Телефон: +8 (800) 555-35-35
          <br>Email: sweetdreams.confectionary@gmail.com
          <br>Часы работы: Ежедневно с 9:00 до 21:00
        </p>
      </div>  
    </div>

    <div class="right-side flex-col">

      <div class="benefits flex-col">
        <h2>Философия качества</h2>
        <ul class="flex-col">
          <li>Натуральные ингредиенты: Мы используем только свежие фермерские продукты, отборный шоколад и натуральные фрукты.</li>
          <li>Ручная работа: Все десерты создаются вручную — никаких конвейеров и заморозки.</li>
          <li>Инновации и традиции: Классические рецепты встречаются с современными трендами, как в нашем хите — торте «Красный бархат» с крем-чизом.</li>
        </ul>
      </div>
      

    </div>
    

    
  </main>

</template>

<style scoped>

main {
  margin-top: 3rem;
  margin-bottom: 3rem;
  min-height: calc(100dvh - 70px);
  gap: 3rem; 
}

h2 {
  font-size: 3rem;
}

h2, p {
  text-align: start;
}

ul {
  gap: 1rem;
}

li {
  list-style-type:square;
}

.left-side {
  gap: 4rem
}

.history, .benefits, .contact-info {
  gap: 2rem;
  text-wrap: balance;
  line-height: 1.2;
}



</style>