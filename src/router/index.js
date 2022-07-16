import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes.js'

const router = createRouter({
    // 采用hash 模式
    // history: createWebHashHistory(),
    
    // 采用 history 模式
    history: createWebHistory(),
    
    // route list
    routes: routes
})

export default router