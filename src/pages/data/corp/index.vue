<template>
	<VuTable
		ref="tableRef" 
		:loading="tableLoading"
		:total="total"
		:allowCreate="true"
		:selectable="true"
		:searchFields="searchFields"
		@rowCreate="handleRowCreateOrEdit"
		@rowEdit="handleRowCreateOrEdit"
		:pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
		:columns="tableColumns"
		:allowView="true"
		@rowView="handleRowClick"
		:rowClick="handleRowClick"
		@query="handleTableQuery"
		:data="tableData">
		<template #batchButtons="{rows}">
			<el-button type="info" :disabled="!rows.length">批量禁用</el-button>
			<el-button type="primary" :disabled="!rows.length">批量启用</el-button>
		</template>
		<template #headerButtons>
			<div class="font small gray"><i class="font red">*</i>鼠标点击一行打开企业详情</div>
		</template>
		<template #tabs>
			<el-tabs @tab-change="handleTabChange" v-model="currentBizType">
				<el-tab-pane v-for="(item, index) in bizTypeOpts" 
					:key="index" 
					:name="item.key"
					:label="item.label">
				</el-tab-pane>
			</el-tabs>
		</template>
	</VuTable>
	
	<el-drawer v-model="drawerVisible" :title="drawerTitle" size="75%">
		<component :is="drawerComponent" :key="componentKey" :config="componentConfig"></component>
	</el-drawer>
</template>

<script setup>
	import cache from '@/utils/cache.js';
	import message from '@/utils/message.js';
	import useService from '@/services/index.js';
	import { getDictLabel } from '@/utils/common.js';
	import UserName from '@/pages/components/user/UserName.vue'
	
	const router = useRouter()
	
	const currentBizType = ref('')
	const bizTypeOpts = ref([])
	cache.dict('biz_type').load().then(dataList => {
		bizTypeOpts.value = dataList;
		currentBizType.value = dataList[0]?.key;
	})
	
	const tableRef = ref()
	const tableData = ref([])
	const tableLoading = ref(false)
	const total = ref(0)
	
	const drawerVisible = ref(false)
	const drawerTitle = ref('')
	const componentKey = ref('')
	const drawerComponent = ref(null)
	const componentConfig = ref({})
	
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
		{ prop: 'status', label: '状态', type: 'switch', 
			config: {
				width: 50,
				activeValue: 1,
				inactiveValue: 0,
				inlinePrompt: true,
				activeText: '正常',
				inactiveText: '禁用',
				disabled: false,
				beforeChange: () => {
					return message('确认？', '是否确认修改企业状态?').confirm()
				},
				change: (e, v) => {
					const { id, status } = v;
					
				}
			}
		},
		{ prop: 'start_time', label: '成立时间', width: '100px' },
		{ prop: 'create_time', label: '录入时间', width: '160px' }
	])
	
	const searchFields = reactive([
		{ name: 'name', label: '名称' },
		{ name: 'code', label: '企业编号', type: 'number', controls: false, labelWidth: '80px' },
	])
	
	const handleTableQuery = (q) => {
		if(!currentBizType.value) {
			return;
		}
		
		tableLoading.value = true;
		q.biz_type = currentBizType.value;
		useService('corp').list(q).then(res => {
			tableLoading.value = false;
			if(res.code === 200) {
				tableData.value =res.data.list
				total.value = res.data.total
			}
		})
	}
	
	const handleTabChange = (e) => {
		tableRef.value.reload()
	}
	
	const handleRowCreateOrEdit = (row) => {
		if(row) {
			return router.push({ path: `edit/${row.id}` })
		}
		
		router.push({ path: 'create' })
	}
	
	const handleRowClick = (row) => {
		drawerVisible.value = true;
		drawerTitle.value = '企业详情';
	}
</script>

<style lang="scss" scoped>
	
</style>