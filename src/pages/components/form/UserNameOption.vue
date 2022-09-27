<template>
	<div>{{data}} - hello</div>
</template>

<script setup>
	const props = defineProps({
		data: { type: [Object, String] }
	})
</script>

<style>
</style>