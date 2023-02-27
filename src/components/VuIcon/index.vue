<template>
	<div class="u-icon">
		<el-avatar :size="size" :src="src" v-if="type === 'image'"></el-avatar> 
		<i :class="`${iconClass} ${iconPrefix}${name}`" :style="{
			'color': `${color || ''}`,
			'font-size': `${size}px`
		}" v-else-if="type === 'font'"></i> 
		<el-icon :size="size" :color="color" v-else>
			<component :is="name"></component>
		</el-icon>
	</div>
</template>

<script setup>
	const props=defineProps({
		type: { type: String, default: 'icon', 
			validator(v) {
				return ['icon', 'font', 'image'].includes(v);
			}
		},
		src: { type: String },
		iconClass: { type: String, default: 'iconfont' },
		iconPrefix: { type: String, default: 'icon-' },
		name: { type: String },
		color: { type: String },
		size: { type: Number }
	})
	
	
</script>

<style lang="scss" scoped>
	@import '/src/assets/common/iconfont.css';
</style>