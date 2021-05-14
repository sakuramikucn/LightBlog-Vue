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
import 'normalize.css'
import 'element-plus/lib/theme-chalk/display.css'

import moment from 'moment'

// 解决 Axios 序列化date参数时区转换为UTC
Date.prototype.toISOString = function(){
    return moment(this).format('YYYY-MM-DD HH:mm:ss')
}



const app = createApp(App)
installElementPlus(app)
app.use(store)
    .use(router)
app.mount('#app')

if (process.env.NODE_ENV == 'development') {
    app.config.devtools = true;
} else {
    app.config.devtools = false;
}