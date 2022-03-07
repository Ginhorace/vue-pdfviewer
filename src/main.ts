import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);

import router from './router/index';
app.use(router);

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
app.use(ElementPlus, {
  locale: zhCn,
});

import store from './store/index';
app.use(store);

app.mount('#app');
