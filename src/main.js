
// Все для VUE
import axios from 'axios';
// axios.defaults.baseURL = 'http://localhost:3000';  // Используйте HTTPS
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'https://www.sweet-dreams-confectionery.ru'; 
axios.defaults.withCredentials = true;

import { createApp } from 'vue'
import App from './App.vue'

import router from './router.js'

// Рендер в HTML
createApp(App).use(router).mount('#app')




  


