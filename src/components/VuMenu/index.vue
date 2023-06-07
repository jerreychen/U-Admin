<template>
	<el-menu class="u-menu"
			:collapse="collapsed"
			:router="!firstLevelOnly"
			:default-active="currentPath"
			:collapse-transition="false"
			:unique-opened="true">
		<template  v-if="firstLevelOnly">
			<el-menu-item v-for="(item, index) in data" 
				@click="handleMenuItemClick(item)"
				:index="`sub-menu-${index}`"
				:key="`sub-menu-${index}`">
				<VuIcon :name="item.icon" v-if="item.icon"></VuIcon>
				<span>{{item.title}}</span>
			</el-menu-item>
		</template>
		<template v-else>
			<VuMenuItem 
				v-for="(item, index) in data"
				:url="item.url"
				:title="item.title"
				:icon="item.icon"
				:children="item.children"
				:parentUrl="parentUrl"
				:menuType="item.menu_type"
				:query="item.query"
				:key="`sub-menu-${index}`">
			</VuMenuItem>
		</template>
	</el-menu> 
</template>

<script setup>
	import VuMenuItem from './VuMenuItem.vue';
	
    const props = defineProps({
        collapsed: { type: Boolean, default: false },
		data: { type: Array, default: () => ([]) },
		parentUrl: { type: String, default: '/' },
		firstLevelOnly: { type: Boolean, default: false }
    })
	
	const emits = defineEmits(['click'])
   
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const currentPath = ref()
	
	const handleMenuItemClick = (item) => {
		emits('click', item);
	}
	
	watch(route, (r)=> {
		if(!props.firstLevelOnly) {
			currentPath.value = r.path
		}
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