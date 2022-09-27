<template>
    <el-container class="layout">
        <ASide :collapsed="collapsed" />
        <el-container class="main">
            <Header>
				<el-icon class="toggle-sidebar" color="#666666" :size="21" @click="handleToggleSidebar">
				    <component :is="collapsed ? 'Expand' : 'Fold'"></component>
				</el-icon>
			</Header>
            <el-main id="main-content" ref="mainContentRef" class="main-content u-scrollbar">
				<VuWaterPrint color="#F9F9F9">
					<router-view v-slot="{ Component, route }">
						<keep-alive v-if="route.meta.keepAlive">
							<component :is="Component" :key="route.name"></component>
						</keep-alive>
						<component :is="Component" :key="route.name" v-else></component>
					</router-view>
				</VuWaterPrint>
			</el-main>
        </el-container>
    </el-container>
	<el-backtop :right="30" :bottom="30" target="#main-content" />
</template>

<script setup> 
	import ASide from './components/ASide.vue'
	import Header from './components/Header.vue'
	
	const store = useStore()
	// 读取缓存
	const {sidebar} = store.getters
	const collapsed = ref(sidebar)
	
	const handleToggleSidebar = () => {
		collapsed.value = !collapsed.value
		// 更新缓存内容
		store.dispatch('app/toggleSidebar')
	}
	
	const mainContentRef = ref(null)
</script>

<style scoped lang="scss">
    .layout {
        height: 100%;

		.toggle-sidebar {
			cursor: pointer;
			margin: 0 .5rem;
		}
		
        .main {
			background-color: $blue;
			flex-direction: column;
		
			.main-content {
				background-color: $lightgray;
				border-radius: 0.75rem 0 0 0;
				height: calc(100vh - 80px);
				overflow-x: hidden;
				overflow-y: auto;
				position: relative;
			}
		}
        
    }
</style>