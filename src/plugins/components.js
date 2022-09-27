// 引入所有图标
import * as Icons from '@element-plus/icons-vue'

/* common components */
// 原生数据类型扩展
export default {
	install(app) {
		const vueIconNameList = [];
        Object.keys(Icons).forEach(key => {
            //name 为icon名称，也是组件名称。使用时：<Edit />，
            //也可以按需增加前缀或者后缀
            // eg: app.component(`eurake-name-${name}`,(Icons as any)[name])
            // 使用时：<eurake-name-Edit />
            // 当然你也可以写一个方法把首字母大写的图标名称改成小写等你想要的任意格式
			vueIconNameList.push(key);
            app.component(key, Icons[key])
        })
        app.config.globalProperties.iconNameList = vueIconNameList;
        
        // 扫描 ./components 目录及其子目录下的所有.vue 文件
        const modulesFiles = import.meta.globEager('./components/**/index.vue')
		
        // 全局注册组件
        Object.keys(modulesFiles).forEach(key => {
            const component = modulesFiles[key].default;
            
            let componentName = component.name
            if(!componentName) {
                const segs = key.split('/')
                // 按照指定格式取得 componentName
                componentName = segs[segs.length - 2]
            }
            
            // 注册
            app.component(componentName, component);
        })
    }
}