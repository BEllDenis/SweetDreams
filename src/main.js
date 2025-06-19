
// // Все для VUE
// import axios from 'axios';
// // axios.defaults.baseURL = 'http://localhost:3000';  // Используйте HTTPS
// axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'https://sweet-dreams-confectionery.ru'; 
// axios.defaults.withCredentials = true;

// import { createApp } from 'vue'
// import App from './App.vue'

// import router from './router.js'

// // Рендер в HTML
// createApp(App).use(router).mount('#app')



// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// Настройка базового URL для API
// В режиме разработки используем переменную окружения VITE_API_URL (например, http://localhost:3000)
// В продакшене обращаемся по относительному пути '/api'

import axios from 'axios'
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true

// console.log(axios.defaults.baseURL);

import router from './router.js'



// Инициализация Vue приложения
createApp(App).use(router).mount('#app')




  


