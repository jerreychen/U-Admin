<template>
	<VuTable
		ref="tableRef"
		:loading="tableLoading"
		:allowEdit="false"
		:allowCreate="false"
		:selectable="true"
		:allowView="true"
		:pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
		:total="tableTotal"
		:columns="tableColumns"
		@rowView="handleRowClick"
		@query="handleTableQuery"
		:rowClick="handleRowClick"
		:data="tableData">
		<template #headerButtons>
			<div class="font small gray"><i class="font red">*</i>鼠标点击一行打开竞价详情</div>
		</template>
	</VuTable>
	
	<el-drawer v-model="drawerVisible" :title="drawerTitle" size="75%">
		<component :is="drawerComponent" :key="componentKey" :config="componentConfig"></component>
	</el-drawer>
</template>

<script setup>
	import useService from '@/services/index.js';
	
	const tableRef = ref(null)
	const tableData = ref([])
	const tableTotal = ref(0)
	const tableLoading = ref(false)
	
	const drawerVisible = ref(false)
	const drawerTitle = ref('')
	const componentKey = ref('')
	const drawerComponent = ref(null)
	const componentConfig = ref({})
	
	const tableColumns = reactive([
		{ prop: 'corp_name', label: '发起企业' },
		{ prop: 'contact', label: '联系人' },
		{ prop: 'from_city', label: '出发城市' },
		{ prop: 'to_city', label: '到达城市' },
		{ prop: 'participants', label: '出价数' },
		{ prop: 'create_time', label: '发起日期', width: '160px' }
	])
	
	const handleTableQuery = (q) => {
		tableLoading.value = true;
		useService('activity').list().then(res => {
			if(res.code != 200) {
				return;
			}
			
			const { total, list } = res.data;
			tableData.value = list;
			tableTotal.value = total;
			tableLoading.value = false;
		})
	}
	
	const handleRowClick = (row) => {
		drawerVisible.value = true;
		drawerTitle.value = '竞价详情';
	}
</script>

<style lang="scss" scoped>
	
</style>