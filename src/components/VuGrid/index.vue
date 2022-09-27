<template>
	<div class="u-grid d-flex row">
		<div class="u-grid-item d-flex column center" v-for="(item, index) in data" :key="index">
			<slot name="item" :item="item"></slot>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		data: { type: Array, default: () => ([]) },
		column: { type: Number, default: 3 }
	})
</script>

<style lang="scss" scoped>
	.u-grid {
		flex-wrap: wrap;
		width: 100%;
		
		.u-grid-item {
			flex: 0 0 calc(100% / v-bind('column'));
		}
	}
</style>