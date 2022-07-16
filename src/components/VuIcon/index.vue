<template>
	<VuFaIcon v-if="isFaIcon" :size="size" :color="color" :name="name"></VuFaIcon>
	<el-icon :size="size" :color="color" v-else>
		<component :is="name"></component>
	</el-icon>
</template>

<script setup>
	const props=defineProps({
		isFaIcon: { type: Boolean, default: false },
		name: { type: String },
		color: { type: String },
		size: { type: Number }
	})
</script>

<style>
</style>