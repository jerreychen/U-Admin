<template>
	<el-tree ref="treeRef"
		:node-key="nodeKey"
		class="u-tree"
		:data="data"
		:props="treeProps"
		@node-click="handleNodeClick"
		:highlight-current="true">
	</el-tree>
</template>

<script setup>
	const treeRef = ref()
	
	const ps = defineProps({
		nodeKey: { type: String, default: 'id' },
		data: { type: Array, default: () => ([]) },
		props: { type: Object, default: () => ({}) },
	})
	
	const emits = defineEmits(['nodeClick'])
	const treeProps = Object.assign({
		value: 'id',
		label: 'label',
		children: 'sub',
	}, ps.props)

	const handleNodeClick = (data, node) => {
		emits('nodeClick', data, node)
	}
</script>

<style lang="scss" scoped>
	.u-tree {
		width: 100%; 
	}
</style>