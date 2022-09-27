<template>
	<el-scrollbar :height="height" class="w-100 u-tree">
		<el-tree ref="treeRef"
			:node-key="nodeKey"
			:data="options"
			:props="treeProps"
			:show-checkbox="true"
			:lazy="lazy && !!lazyLoad"
			:load="lazyLoad"
			:check-on-click-node="checkOnNode"
			@check="handleCheckChange"
			@node-click="handleNodeClick"
			:highlight-current="true">
		</el-tree>
	</el-scrollbar>
</template>

<script setup>
	const treeRef = ref()
	
	const ps = defineProps({
		modelValue: { type: Array, default: () => ([]) },
		nodeKey: { type: String, default: 'id' },
		props: { type: Object, default: () => ({}) },
		height: { type: [Number, String], default: 200 },
		lazy: { type: Boolean, default: false },
		lazyLoad: { type: Function },
		options: { type: Array, default: () => ([]) },
		checkOnNode: { type: Boolean, default: false }
	})
	
	const emits = defineEmits(['update:modelValue', 'nodeClick'])
	
	const treeProps = Object.assign({
		value: 'id',
		label: 'label',
		children: 'children',
	}, ps.props)
	
	nextTick(() =>{ 
		treeRef.value.setCheckedKeys(ps.modelValue)
	})

	const handleNodeClick = (data, node) => {
		emits('nodeClick', data, node)
	}
	
	const handleCheckChange = (node, { checkedKeys }) => {
		emits('update:modelValue', checkedKeys);
	}
</script>

<style lang="scss" scoped> 
	.u-tree {
		border: 1px solid var(--el-input-border-color, var(--el-border-color));
		border-radius: 4px;
	}
</style>