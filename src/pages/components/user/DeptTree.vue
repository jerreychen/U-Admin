<template>
	<div class="padding-2">
		<el-input prefix-icon="Search" v-model="keyword"></el-input>
	</div>
	<el-tree ref="treeRef" class="dept-tree"
		:highlight-current="true"
		:default-expand-all="true"
		:props="{ children: 'children', label: 'title' }"
		:filter-node-method="handleTreeFilter"
		:data="deptTreeList">
	</el-tree>
</template>

<script setup>
	import { getDeptTree } from '@/services/user.js';
	const treeRef = ref(null)
	const deptTreeList = ref([])
	
	const keyword = ref('')
	watch(keyword, (val) => {
	  treeRef.value?.filter(val)
	})
	const handleTreeFilter = (v, item) => {
		if (!v) {
			return true
		}
		
		return item['title']?.indexOf(v) >= 0
	}
	
	getDeptTree().then(res => {
		if(res.code != 200) {
			return;
		}
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