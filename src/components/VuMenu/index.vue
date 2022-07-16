<template>
	<el-menu class="u-menu"
			:collapse="collapsed"
			:router="true"
			:default-active="currentPath"
			:collapse-transition="false"
			:unique-opened="true">
		<VuMenuItem 
			v-for="(item, index) in data"
			:url="item.url"
			:title="item.title"
			:icon="item.icon"
			:children="item.children"
			parentUrl="/"
			:menuType="item.menu_type"
			:key="`sub-menu-${index}`">
		</VuMenuItem>
	</el-menu> 
</template>

<script setup>
	import VuMenuItem from './VuMenuItem.vue';
	
    defineProps({
        collapsed: { type: Boolean, default: false },
		data: { type: Array, default: () => ([]) }
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
</script>

<style lang="scss" scoped>
	.u-menu {
		&.el-menu {
			border-right: 0;
		}
	}
</style>