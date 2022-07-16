import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())
    
    return {
        base: env.VITE_APP_ENV === 'production' ? '/' : '/',
        
        resolve: {
            alias: {
                '/~': path.resolve(__dirname, './'),
                // 键必须以斜线开始和结束
                '/@': path.resolve(__dirname, './src')
            },
        },
        build:{
			minify: 'terser',
            // 静态资源目录
            assetsDir:"assets",
            // 输出目录
            outDir: 'dist',
			// 生产环境移除console
			terserOptions: {
				output: {
					// 去掉注释内容
					comments: true,
				},
				compress: {
					//打包时删除console
					drop_console: mode !== 'development',
					//打包时删除 debugger
					drop_debugger: mode !== 'development'
				},
			},
			// 分包策略
			rollupOptions: {
				output: {
					assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
				}
			}
        },
        plugins: [
            vue(),
            
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
                    //additionalData: `@import "/@/assets/common/variables.scss";`
					additionalData(content, fp) {
						if(fp.endsWith('/common/variables.scss')) {
							return content
						}
						return `@import "/@/assets/common/variables.scss";${content}`
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