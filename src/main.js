import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router/index.js'
import './router/permission.js'
import store from './store/index.js'
import ElementPlus from 'element-plus'
// 中文
import locale from 'element-plus/lib/locale/lang/zh-cn'
// 引用原生类型扩展插件
import prototypes from './plugins/prototypes.js'
// 引用自定义组件库
import Components from './plugins/components.js'
// 引用自定义指令
import Directive from './plugins/directive.js'
import Extensions from './plugins/extensions.js'

// 创建并挂载实例
const app = createApp(App)
// 应用路由
app.use(router)
app.use(store)
app.use(ElementPlus, { locale })
// 应用扩展插件
app.use(prototypes)
// 应用自定义组件库
app.use(Components)
// 应用自定义指令
app.use(Directive)
app.use(Extensions)
// 启动应用
app.mount('#app')
