<template>
	<VuTable
		ref="tableRef" 
		title="角色"
		:loading="tableLoading"
		:total="total"
		:get="handleGetRole"
		:editorFields="editorFields"
		:allowCreate="true"
		:pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
		:columns="tableColumns"
		@query="handleTableQuery"
		@create="handleCreateRole"
		@update="handleUpdateRole"
		:data="tableData">
	</VuTable>
</template>

<script setup>
	import cache from '@/utils/cache.js';
	import message from '@/utils/message.js';
	import useService from '@/services/index.js';
	import { getDeptTree } from '@/services/app.js';
	
	const store = useStore()
	
	const tableRef = ref()
	const tableData = ref([])
	const total = ref(0)
	const tableLoading = ref(false)
	
	const tableColumns = reactive([
		{ prop: 'title', label: '角色名称' },
		{ prop: 'name', label: '权限标识' },
		{ prop: 'description', label: '描述' },
		{ prop: 'create_time', label: '创建时间', width: '160px' }
	])
	
	const editorFields = reactive([ 
		{ name: 'title', label: '角色名称' },
		{ name: 'name', label: '权限标识' },
		/*{ name: 'menu_ids', label: '菜单列表', type: 'tree-select',
			options: store.getters.menuList,
			nodeKey: 'id',
			showCheckbox: true,
			multiple: true,
			props: {
				children: 'children', 
				label: 'title'
			}
		},*/
		{ name: 'menu_ids', label: '菜单列表', type: 'tree-checkbox',
			options: store.getters.menuList,
			props: {
				children: 'children', 
				label: 'title'
			}
		},
		{ name: 'description', label: '描述', type: 'textarea' },
	])
	
	const handleGetRole = (id) => {
		return useService('role').get({ id }).then(res => {
			return res.data || {}
		})
	}
	
	const handleCreateRole = (formData, { visible }) => {
		useService('role').create(formData).then(res => {
			if(res.code === 200) {
				message('成功提示', '新增角色成功！').notify('success')
				visible.value = false
				tableRef.value.reload()
			}
		})
	}
	
	const handleUpdateRole = (formData, { visible }) => {
		useService('role').update(formData).then(res => {
			if(res.code === 200) {
				message('成功提示', '编辑角色成功！').notify('success')
				visible.value = false
				tableRef.value.reload()
			}
		})
	}
	
	const handleTableQuery = (q) => {
		tableLoading.value = true;
		useService('role').list(q).then(res => {
			tableLoading.value = false;
			if(res.code === 200) {
				tableData.value =res.data.list
				total.value = res.data.total
			}
		})
	}
</script>

<style lang="scss" scoped>
	
</style>