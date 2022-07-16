<template> 
        <VuTable 
			:columns="tableColumns" 
			:total="total" 
			:searchFields="fields"
			:loading="loading"
			:data="tableData"
            :selectable="true"
            @create="goto('/system/content/add')"
            @batchDelete="handleBatchDelete"
            @rowView="handleRowView"
			@rowDelete="handleRowDelete"
			@query="handleQuery"
			@reset="handleReset">
		</VuTable> 
		
		<VuDialog title="编辑" @cancel="dialogVisible = false" :visible="dialogVisible">
			<VuForm :fields="editorFields" @submit="handleConfirmSave" :value="dataItem" />
		</VuDialog>
</template>

<script setup>
	import { getVideoList } from '/@/services/app.js'
	import { message } from '/@/utils/common.js'
	
	const loading = ref(false)
	const fields = reactive([
		{ label: '标题', name: 'title' },
		{ label: '主图',  name: 'poster' },
		{ label: '时间', name: 'timer', hidden: true },
		{ label: 'VID', name: 'vid', hidden: true }
	])
    const tableColumns = reactive([
        { label: '标题', prop: 'title', fixed: 'left' },
        { label: '主图', prop: 'poster', type: 'avatar', 
			config: { 
				click: () => {
					console.log('click')
				}
			} ,
		},
        { label: '时间', prop: 'timer', },
        { label: 'VID', prop: 'vid', type: 'text' },
        { label: '简介', prop: 'test', type: 'component', config:{ component: 'ElRate' } }
    ])
	
	const dataItem = ref(null)
	const editorFields = reactive([
		{ label: '标题', name: 'title' },
		{ label: '主图',  name: 'poster' },
		{ label: '时间', name: 'timer' },
		{ label: 'VID', name: 'vid' }
	])
    
    const tableData = ref()
	const total = ref(0)
	
	const dialogVisible = ref(false)
	
    const handleBatchDelete = (rows) => {
        rows.map(row => {
            console.log(row, row.title)
        })
    }
    
    const handleQuery = (q) => {
		loading.value = true 
		getVideoList(q).then(res => {
			tableData.value = res.data
			total.value = 900
			loading.value = false
		})
	}
    const handleRowView = (row) => {
        dialogVisible.value = true
		dataItem.value = row
    }
	
	
	const handleReset = () => {
		console.log('reset')
	}
	
	const handleRowDelete = (row) =>  {
		console.log(row)
		message('测试', '确定删除').alert()
	}
	
	const handleConfirmSave = (data) => {
		console.log(data)
	}
</script>

<style>
</style>