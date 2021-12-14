import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import store from './store'
import axios from 'axios'
import SlideVerify from 'vue-monoplasty-slide-verify'
Vue.use(SlideVerify)

Vue.config.productionTip = false

// axios.defaults.baseURL = 'http://www.hmetao.cn:9002/hmetao_blog/'
axios.defaults.baseURL = 'http://localhost:8080/bear_blog/'
axios.defaults.timeout = 8000
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = JSON.parse(window.localStorage.getItem('token'))
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
