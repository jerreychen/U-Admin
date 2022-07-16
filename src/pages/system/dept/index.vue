<template>
	<VuTable
		ref="tableRef" 
		title="部门"
		:loading="tableLoading"
		:get="handleGetDept"
		:editorFields="editorFields"
		:allowCreate="true"
		:pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
		:rowActionButtons="rowActionButtons"
		:columns="tableColumns"
		@query="handleTableQuery"
		@create="handleCreateDept"
		@update="handleUpdateDept"
		:data="tableData">
	</VuTable>
</template>

<script setup>
	import cache from '/@/utils/cache.js';
	import message from '/@/utils/message.js';
	import useService from '/@/services/index.js';
	import { getDeptTree } from '/@/services/app.js';
	
	const tableRef = ref()
	const tableData = ref([])
	const tableLoading = ref(false)
	
	const tableColumns = reactive([
		{ prop: 'title', label: '部门名称' },
		{ prop: 'description', label: '描述' },
		{ prop: 'create_time', label: '创建时间', width: '160px' }
	])
	
	const deptOpts = computed(() => {
		return [{ id: 0, title: '无上级' }].concat(tableData.value)
	})
	const editorFields = reactive([
		{ name: 'parent_id', label: '上级部门', type: 'tree-select' ,
			options: deptOpts,
			nodeKey: 'id',
			checkStrictly: true,
			props: {
				children: 'children', 
				label: 'title'
			}
		},
		{ name: 'title', label: '部门名称' },
		{ name: 'description', label: '描述', type: 'textarea' },
	])
	
	const rowActionButtons = reactive([
		{ name: 'add', label: '新增', icon: 'Plus',
			click(row) {
				tableRef.value.create({ parent_id: row.id })
			}
		}
	])
	
	const handleGetDept = (id) => {
		return useService('dept').get({ id }).then(res => {
			return res.data || {}
		})
	}
	
	const handleCreateDept = (formData, { visible }) => {
		useService('dept').create(formData).then(res => {
			if(res.code === 200) {
				message('成功提示', '新增部门成功！').notify('success')
				visible.value = false
				tableRef.value.reload()
			}
		})
	}
	
	const handleUpdateDept = (formData, { visible }) => {
		useService('dept').update(formData).then(res => {
			if(res.code === 200) {
				message('成功提示', '编辑部门成功！').notify('success')
				visible.value = false
				tableRef.value.reload()
			}
		})
	}
	
	const handleTableQuery = (q) => {
		tableLoading.value = true;
		getDeptTree(q).then(res => {
			tableLoading.value = false;
			if(res.code === 200) {
				tableData.value =res.data
			}
		})
	}
</script>

<style lang="scss" scoped>
	
</style>