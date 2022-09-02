<template>
	<i :class="`${iconPrefix} ${name}`" :style="{
		'color': `${color || ''}`,
		'font-size': `${size}px`
	}"></i>
</template>

<script setup>
	const props = defineProps({
		iconPrefix: { type: String, default: 'iconfont' },
		name: { type: String, required: true },
		color: { type: String },
		size: { type: Number, default: 12 }
	})
</script>

<style>
</style>