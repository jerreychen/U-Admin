<template>
	<div>
		Home
	</div>
</template>

<script setup>
	import message from '@/utils/message.js';
	import cache from '@/utils/cache.js';
	import useService from '@/services/index.js';
	
	const route = useRoute()
	console.log(route)
	const pageName = route.query.name;
	console.log(pageName)
	console.log('home')
</script>

<style>
</style>