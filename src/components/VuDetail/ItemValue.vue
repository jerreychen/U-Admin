<template>
	<div class="item-value"
		:class="{
			'collapsable': !!item.collapsable && collapsed
		}">
		<div ref="valueRef">
			<template v-if="item.formatter">
				<span v-if="item.type === 'html'" v-html="item.formatter(value[item.name], value, item) || ''"></span>
				<span v-else>{{item.formatter(value[item.name], value, item) || ''}}</span>
			</template>
			<template v-else>
				<span v-if="item.type === 'html'" v-html="value[item.name]"></span>
				<span v-else>{{value[item.name]}}</span>
			</template>
		</div>
		<el-link class="show-more" 
			type="warning" icon="ArrowDown"
			v-if="!!item.collapsable && collapsed" @click="handleShowMore">显示更多</el-link>
	</div>
</template>

<script setup>
	const props = defineProps({
		value: { type: Object },
		item: { type: Object }
	})
	
	const valueRef = ref()
	const collapsed = ref(false)
	
	const handleShowMore = () => {
		collapsed.value = false
	}
	
	onMounted(() => {
		if(props.item.collapsable && valueRef.value.clientHeight > 100) {
			collapsed.value = true
		}
	})
	
</script>

<style lang="scss" scoped>
	.item-value {
		
		&.collapsable {
			max-height: 100px;
			overflow: hidden;
			margin-bottom: 1.5rem;
		}
		
		.show-more {
			bottom: 0;
			position: absolute;
			right: 0;
		}
	}
</style>