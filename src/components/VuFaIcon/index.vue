<template>
	<i :class="`fa fa-${name}`" :style="{
		'color': `${color || ''}`,
		'font-size': `${size}px`
	}"></i>
</template>

<script setup>
	import 'font-awesome/css/font-awesome.min.css'
	
	const props = defineProps({
		name: { type: String, required: true },
		color: { type: String },
		size: { type: Number, default: 12 }
	})
</script>

<style>
</style>