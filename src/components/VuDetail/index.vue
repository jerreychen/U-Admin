<template>
	<div class="u-detail">
		<div class="u-detail_item padding-y-1 d-flex left"
			:class="`${item.class || ''} ${item.labelPosition === 'top' ? 'column' : 'row'}`"
			:style="item.style"
			v-for="(item, index) in items" 
			:key="index">
			<el-divider v-if="item.type === 'line'" :content-position="item.contentPosition">{{item.label}}</el-divider>
			<template v-else-if="!item.hideEmpty || !isNullOrEmpty(value[item.name])">
				<div class="label" :class="{
					'justify': labelJustify,
					'align-left': !labelJustify && labelAlignLeft,
					'align-right': !labelJustify && labelAlignRight,
					'align-center': !labelJustify && labelAlignCenter,
				}">
					<label v-if="isFunction(item.label)">{{item.label(item.label, value)}}</label>
					<label v-else>{{item.label}}</label>
				</div>
				<div class="value flex-item grow">
					<el-image v-if="item.type === 'image'" 
						:src="value[item.name]" 
						:preview-src-list="item.preview ? [value[item.name]] : []"
						:style="item.imageStyle">
					</el-image>
					
					<component v-else-if="item.type === 'component' && !!item.component"
						:is="item.component"
						:data="value"
						:item="item">
					</component>
					
					<ItemValue :item="item" :value="value" v-else></ItemValue>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup>
	import ItemValue from './ItemValue.vue';
	
	const props = defineProps({
		value: { type: Object, default: () => ({}) },
		items: { type: Array, default: () => ([]) },
		labelWidth: { type: String, default: '120px' },
		labelJustify: { type: Boolean, default: false },
		labelAlign: { type: String, default: 'right' }
	})
	
	const labelAlignLeft = computed(() => {
		return props.labelAlign === 'left'
	})
	
	const labelAlignRight = computed(() => {
		return props.labelAlign === 'right'
	})
	
	const labelAlignCenter = computed(() => {
		return props.labelAlign === 'center'
	})
</script>

<style lang="scss" scoped>
	.u-detail {
		position: relative;
		width: 100%;
		
		.u-detail_item {
			line-height: 1.5rem;
			position: relative;
			
			.label {
				color: #999;
				padding-right: .5rem;
				position: relative;
				width: v-bind(labelWidth);
				
				&.justify {
					text-align-last: justify;
					word-break: keep-all;
				}
				
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