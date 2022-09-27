<template>
	<VuTable
		ref="tableRef" 
		title="客户"
		:loading="tableLoading"
		:total="total"
		:allowCreate="true"
		:expandable="true"
		:pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
		:columns="tableColumns"
		@query="handleTableQuery"
		:data="tableData">
		<template #expandContent="{item}">
			<div class="inner-table">
				<VuTable
					:columns="innerTableFields"
					:allowEdit="false"
					:data="item.corps">
				</VuTable>
			</div>
		</template>
	</VuTable>
</template>

<script setup>
	import cache from '@/utils/cache.js';
	import useService from '@/services/index.js';
	import { listCustomer } from '@/services/user.js';
	import { getDictLabel } from '@/utils/common.js';
	
	const genderOpts = ref([])
	cache.dict('gender').load().then(dictList => {
		genderOpts.value = dictList
	})
	 
	const tableRef = ref()
	const tableData = ref([])
	const tableLoading = ref(false)
	const total = ref(0)
	const tableColumns = reactive([
		{ prop: 'serial_number', label: '编号', width: '150px' },
		{ prop: 'username', label: '账号', width: '100px' },
		{ prop: 'email', label: '邮箱地址', width: '150px' },
		{ prop: 'mobile', label: '手机号', width: '150px' },
		{ prop: 'nickname', label: '昵称' },
		{ prop: 'avatar', label: '头像', type: 'avatar', width: '65px' },
		{ prop: 'name', label: '姓名', formatter(row) {
			return `${row['last_name'] || ''}${row['first_name'] || ''}`
		} },
		{ prop: 'gender', label: '性别',
			formatter(row) {
				return getDictLabel(genderOpts.value, row['gender'])
			}
		},
		{ prop: 'create_time', label: '创建时间', width: '160px' }
	])
	
	const innerTableFields = reactive([
		{ prop: 'id', label: '编号' }
	])
	
	const handleTableQuery = (q) => {
		tableLoading.value = true;
		listCustomer(q).then(res => {
			tableLoading.value = false;
			if(res.code === 200) {
				tableData.value =res.data.list
				total.value = res.data.total
			}
		})
	}
</script>

<style lang="scss" scoped>
	.inner-table {
		:deep(.u-table-wrapper) {
			padding: 0 0 0 2rem !important;
		}
	}
</style>