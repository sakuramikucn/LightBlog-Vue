import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import installElementPlus from './plugins/element'
import 'element-plus/lib/theme-chalk/index.css'
import './styles/index.scss'
import 'normalize.css';
import 'element-plus/lib/theme-chalk/display.css';

const app = createApp(App)
installElementPlus(app)
app.use(store)
    .use(router)
app.mount('#app')