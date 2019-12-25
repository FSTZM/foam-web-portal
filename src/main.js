import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "./assets/styles/reset.css";
import "./assets/styles/border.css";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import axios from "./http.js";
import qs from "qs";

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

import VueCookies from 'vue-cookies';

Vue.use(VueCookies);

Vue.use(mavonEditor);
Vue.use(ElementUI);
Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
