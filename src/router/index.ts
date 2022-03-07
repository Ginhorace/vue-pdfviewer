import { createRouter, createWebHistory } from 'vue-router';
import Home from 'components/View/Home.vue';
import Sample from 'components/View/Sample.vue';
import Test from 'components/View/Test.vue';
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
  {
    path: '/sample',
    name: 'Sample',
    component: Sample,
    meta: {
      title: '样本查看',
      keepAlive: true, // 需要被缓存
    },
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    meta: {
      title: '测试',
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
