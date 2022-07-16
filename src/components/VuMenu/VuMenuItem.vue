<template>
	<el-sub-menu :index="combinePath(parentUrl, url)" v-if="menuType === 0">
		<template #title>
		    <VuIcon :name="icon" v-if="icon"></VuIcon>
		    <span>{{title}}</span>
		</template>
		<template :key="`menu-item-${index}`" v-for="(item, index) in children">
			<VuMenuItem v-if="item.menu_type === 0"
				:url="item.url"
				:title="item.title"
				:icon="item.icon"
				:children="item.children"
				:parentUrl="combinePath(parentUrl, url)"
				:menuType="item.menu_type"></VuMenuItem>
			<el-menu-item :index="combinePath(parentUrl, url, item.url)" v-else>
				<VuIcon :name="item.icon" v-if="item.icon"></VuIcon>
				<span>{{item.title}}</span>
			</el-menu-item>
		</template>
	</el-sub-menu>
	<el-menu-item :index="combinePath(parentUrl, url)" v-else>
		<VuIcon :name="item.icon" v-if="item.icon"></VuIcon>
		<span>{{item.title}}</span>
	</el-menu-item>
</template>

<script setup>
	import VuMenuItem from './VuMenuItem.vue';
	
	const props = defineProps({
		menuType: { type: Number, default: 0 }, // menu_type: 0 -folder, 1 -link
		icon: { type: String },
		parentUrl: { type: String },
		url: { type: String },
		title: { type: String },
		children: { type: Array }
	})
</script>

<style lang="scss" scoped>
</style>