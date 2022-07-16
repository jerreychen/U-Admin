<template>
	<el-tree class="dept-tree"
		:highlight-current="true"
		:default-expand-all="true"
		:props="{ children: 'children', label: 'title' }"
		:data="deptTreeList">
	</el-tree>
</template>

<script setup>
	import { getDeptTree } from '/@/services/user.js';
	const deptTreeList = ref([])
	
	getDeptTree().then(res => {
		deptTreeList.value = res.data
	})
</script>

<style lang="scss" scoped>
	.dept-tree {
		:deep(.el-tree-node__content) {
			padding: .5rem !important;
		}
	}
</style>