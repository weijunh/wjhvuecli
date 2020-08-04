import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../pages/Home.vue';
import About from '../pages/About.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // 当使用es10的语法 会自动打包成单独的文件
    // component: () => import(/* webpackChunkName: "about" */ '../pages/About.vue')
    component: About
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
