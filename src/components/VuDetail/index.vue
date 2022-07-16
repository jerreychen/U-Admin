<template>
	<div class="u-detail">
		<div class="u-detail_item padding-y-1 d-flex row"
			:class="item.class || ''"
			v-for="(item, index) in items" 
			:key="index">
			<label class="label">{{item.label}}</label>
			<template v-if="isHtml">
				<template v-if="item.formatter">
					<span class="value flex-item grow" v-html="item.formatter(value[item.name], item) || ''"></span>
				</template>
				<span class="value flex-item grow" v-html="value[item.name]" v-else></span>
			</template>
			<template v-else>
				<template v-if="item.formatter">
					<span class="value flex-item grow">{{item.formatter(value[item.name], item) || ''}}</span>
				</template>
				<span class="value flex-item grow" v-else>{{value[item.name]}}</span>
			</template>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		value: { type: Object, default: () => ({}) },
		items: { type: Array, default: () => ([]) },
		isHtml: { type: Boolean, default: false }
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