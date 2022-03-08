import { createRouter, createWebHistory } from 'vue-router';
import Home from 'components/View/Home.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '标注',
      keepAlive: true, // 需要被缓存
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  window.document.title = 'OCR管理-' + to.meta.title;
  next();
});
export default router;
