<template>
	<VuTable
		ref="tableRef" 
		:loading="tableLoading"
		:total="total"
		:allowCreate="true"
		@rowCreate="handleRowCreateOrEdit"
		@rowEdit="handleRowCreateOrEdit"
		:pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
		:columns="tableColumns"
		@query="handleTableQuery"
		:data="tableData">
	</VuTable>
</template>

<script setup>
	import cache from '/@/utils/cache.js';
	import useService from '/@/services/index.js';
	import { getDictLabel } from '/@/utils/common.js';
	import UserName from '/@/pages/components/user/UserName.vue'
	
	const router = useRouter()
	
	const tableRef = ref()
	const tableData = ref([])
	const tableLoading = ref(false)
	const total = ref(0)
	const tableColumns = reactive([
		{ prop: 'code', label: '企业编号', width: '180px' },
		{ prop: 'name', label: '名称', width: '250px' },
		{ prop: 'address', label: '地址', width: '300px' },
		{ prop: 'manager', label: '法人代表', type: 'component', width: '100px',
			config: {
				component: markRaw(UserName) ,
				name: 'manager',
				mobile: 'manager_tel'
			}
		},
		{ prop: 'contact', label: '联系人', type: 'component', width: '100px',
			config: {
				component: markRaw(UserName) ,
				name: 'contact',
				mobile: 'contact_tel'
			}
		},
		{ prop: 'start_time', label: '成立时间', width: '100px' },
		{ prop: 'create_time', label: '录入时间', width: '160px' }
	])
	
	const handleTableQuery = (q) => {
		tableLoading.value = true;
		useService('corp').list(q).then(res => {
			tableLoading.value = false;
			if(res.code === 200) {
				tableData.value =res.data.list
				total.value = res.data.total
			}
		})
	}
	
	const handleRowCreateOrEdit = (row) => {
		if(row) {
			return router.push({ path: `edit/${row.id}` })
		}
		
		router.push({ path: 'create' })
	}
</script>

<style lang="scss" scoped>
	
</style>