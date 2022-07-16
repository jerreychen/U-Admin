<template>
<div class="u-menu-wrapper">
	<div class="dashboard-home d-flex row middle" @click="goto('/home')">
		<el-icon class="icon-home" :size="16"><House /></el-icon>
		<span class="label-home" v-if="!collapse">控制面板</span>
	</div>
	<div class="u-menu-content u-scrollbar">
    <el-menu class="u-menu"
            :collapse="collapse"
            :router="true"
            :default-active="currentPath"
            :collapse-transition="false"
            :unique-opened="true">
        <template v-for="(menu, index) in menuList" :key="`sub-menu-${index}`">
            <el-sub-menu
                :index="menu.path || `${index}`" 
                v-if="menu.children && menu.children.length > 0">
                <template #title>
                    <el-icon v-if="menu.icon">
                        <component :is="menu.icon" />
                    </el-icon>
                    <span>{{menu.label}}</span>
                </template>
                <el-menu-item 
                    :index="combinePath(menu.path, item.path) || `${index}-${idx}`" 
                    v-for="(item, idx) in menu.children" 
                    :key="`menu-item-${idx}`">
					<el-icon v-if="item.icon">
						<component :is="item.icon" />
					</el-icon>
                    <span>{{item.label}}</span>
                </el-menu-item>
            </el-sub-menu>
			<template v-else>
				<el-menu-item :index="menu.path || `${index}`" v-if="menu.type === 1">
					<el-icon v-if="menu.icon">
						<component :is="menu.icon" />
					</el-icon>
					<template #title>{{menu.label}}</template>
				</el-menu-item>
				<el-sub-menu :index="menu.path || `${index}`" v-else>
					<template #title>
						<el-icon v-if="menu.icon">
							<component :is="menu.icon" />
						</el-icon>
						<span>{{menu.label}}</span>
					</template>
				</el-sub-menu>
			</template>
        </template>
    </el-menu>
	</div>
</div>
</template>

<script setup>
    
    defineProps({
        collapse: { type: Boolean, default: false }
    })
   
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const currentPath = ref()
	
	watch(route, (r)=> {
		currentPath.value = r.path
	}, {
	    immediate: true
	})
	
    const menuList = reactive([])
    store.getters.routeList.forEach(item => {
        if(!item.hidden && item.type != 2) {
			const { id, name, url, type, path, iconName } = item
			
			let menu = {
				label: name,
				path: url,
				type,
				icon: iconName
			}
            // 过滤子菜单中的 hidden 字段
            menu.children = (item.sub || []).filter(m => {
                return !m.hidden && m.type != 2
            }).map(item => {
				return {
					label: item.name,
					path: item.url,
					type: item.type,
					icon: item.iconName
				}
			})
            // 添加菜单项
            menuList.push(menu)
        }
    })
    
</script>

<style lang="scss" scoped>
	.dashboard-home {
		background-color: $blue;
		color: $white;
		cursor: pointer;
		font-size: bold;
		padding:1rem;
		position: relative;
		
		.icon-home {
			width:2rem;
		}
		.label-home {
			height: 1rem;
			overflow: hidden;
		}
	}
	
    .u-menu-wrapper { 
		height: 100%; 
		
		.u-menu-content {
			height: calc(100% - 48px);
			overflow-x: hidden;
			overflow-y: auto;
		}
	}
    .u-menu {
        border-right: 0;
    }
</style>