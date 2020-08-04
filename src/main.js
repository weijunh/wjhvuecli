import './assets/css/reset.css';
import './assets/css/common.less';

import Vue from 'vue';
import App from './app.vue';
import router from './router';

const promise = new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
console.log(promise);

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
