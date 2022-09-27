import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue' 
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
// vite.config.js 文件
import eslintPlugin from 'vite-plugin-eslint'


// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())
    
    return {
        base: env.VITE_APP_ENV === 'production' ? '/' : '/',
        
        resolve: {
            alias: {
				// 当前目录
                '~': fileURLToPath(new URL('./', import.meta.url)),
                // 根目录
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build:{
            // 静态资源目录
            assetsDir:"assets",
            // 输出目录
            outDir: 'dist',
			// 分包策略
			rollupOptions: {
				output: {
					assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
				}
			}
        },
        plugins: [
            vue(),
            eslintPlugin({
				include: ['src/*.js']
			}),
            AutoImport({
                imports: ['vue', 'vuex', 'vue-router'],
                resolvers: [
                    // 自动导入 Element Plus 相关函数
                    ElementPlusResolver()
                ],
            }),
            Components({
                resolvers: [
                    // 自动导入 Element Plus 组件
                    ElementPlusResolver()
                ],
            }),
            
            createHtmlPlugin({ 
                inject: {
                    // 入口文件 index.html 的模板注入
                    data: {
                        title: env.VITE_APP_TITLE,
                        injectScript: `<script src="./inject.js"></script>`,
                    },
                },
            })
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    // 引入 variables.scss 这样就可以在全局中使用 variables.scss中预定义的变量了
                    //additionalData: `@import "@/assets/common/variables.scss";`
					additionalData(content, fp) {
						if(fp.endsWith('/common/variables.scss')) {
							return content
						}
						return `@import "@/assets/common/variables.scss";${content}`
					}
                }
            }
        },
        server: {
            // 反向代理
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_APP_API_HOST,
                    changeOrigin: true,
                    rewrite: path => path.replace(env.VITE_APP_BASE_API, '')
                }
            },
        }
    }
})