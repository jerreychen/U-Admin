<template>
	<div class="u-detail">
		<div class="u-detail_item padding-y-1 d-flex row"
			:class="item.class || ''"
			v-for="(item, index) in items" 
			:key="index">
			<template v-if="!item.hideEmpty || !isNullOrEmpty(value[item.name])">
				<label class="label" v-if="isFunction(item.label)">{{item.label(item.label, value)}}</label>
				<label class="label" v-else>{{item.label}}</label>
				<ItemValue class="value flex-item grow" :item="item" :value="value"></ItemValue>
			</template>
		</div>
	</div>
</template>

<script setup>
	import ItemValue from './ItemValue.vue';
	
	const props = defineProps({
		value: { type: Object, default: () => ({}) },
		items: { type: Array, default: () => ([]) }
	})
</script>

<style lang="scss" scoped>
	.u-detail {
		position: relative;
		width: 100%;
		
		.u-detail_item {
			position: relative;
			
			.label {
				padding-right: .5rem;
				position: relative;
				text-align-last: justify;
				word-break: keep-all;
				
				&::after {
					content: ':';
					position: absolute;
					right: 0;
				}
			}
			.value {
				margin-left: .5rem;
				text-align: left;
			}
			
		}
	}
</style>