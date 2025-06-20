<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
};
</script>

<template>
  <footer class="flex-row">
    <div class="contacts flex-col">
      <p class="header">Контакты:</p>

      <div class="contacts_info flex-col">
        <div class="contacts_info-text flex-row">
          <i class="icon icon-location"></i>
          <p class="text">Адрес: г. Амурск, ул. Ленина, д. 15</p>
        </div>

        <div class="contacts_info-text flex-row">
          <i class="icon icon-work_time"></i>
          <p class="text">Режим работы: Пн-Вс, с 9:00 до 21:00</p>
        </div>

        <div class="contacts_info-text flex-row">
          <i class="icon icon-phone"></i>
          <p class="text">Телефон: +8 (800) 555-35-35</p>
        </div>

        <div class="contacts_info-text flex-row">
          <i class="icon icon-mail"></i>
          <p class="text">Почта: sweetdreams.confectionary@gmail.com</p>
        </div>
      </div>
    </div>

    <div class="about_us flex-col">
      <p class="header">О нас:</p>

      <p class="text">
        Наша кондитерская существует с 2023 года и с тех пор радует своих
        клиентов безупречным качеством и разнообразием сладких шедевров. Каждый
        наш продукт создан с любовью и только из натуральных ингредиентов.
      </p>
    </div>
  </footer>
</template>

<style>
/* ========================= FOOTER ========================= */

footer {
  justify-content: space-between;
  align-items: center;

  width: 100%;
  /* height: 260x; */

  padding: 3rem;

  color: var(--white);

  background: linear-gradient(
      90deg,
      rgb(0, 0, 0, 0.7) 0%,
      rgb(0, 0, 0, 0) 50%,
      rgb(0, 0, 0, 0.7) 100%
    ),
    url(../assets/images/LandingPage/Footer_Image.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  /* filter: drop-shadow(0px 0px 20px rgb(0,0,0, 0.2)); */
}

footer .header {
  font-size: 1.7rem;
}

footer .icon {
  font-size: 1.2rem;
}

footer p {
  font-size: 1rem;
}

/* ------------- Contacts ------------- */

.contacts,
.about_us {
  gap: 2rem;
}

.contacts_info {
  gap: 0.5rem;
}

.contacts_info-text {
  align-items: center;
  gap: 1rem;
}

footer .contacts_info-text p {
  padding-top: 0.15rem;
}

/* ------------- About Us ------------- */

.about_us {
  width: 30dvw;

  text-align: right;
  text-wrap: balance;
  line-height: 1.1;
}
</style>
