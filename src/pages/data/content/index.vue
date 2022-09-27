<template> 
	<VuTable ref="tableRef"
		title="文章内容"
		:columns="tableColumns" 
		:total="total" 
		:allowCreate="true"
		:searchFields="searchFields"
		:loading="tableLoading"
		:data="tableData"
		:selectable="true"
		:rowActionColumnWidth="150"
		:rowActionButtons="rowActionButtons"
		:rowActionButton="handleRowActionButton"
		:rowEditButtonProps="rowEditBtnProps"
		:rowDeleteButtonProps="rowEditBtnProps"
		@rowCreate="handleRowCreateEdit"
		@rowEdit="handleRowCreateEdit"
		@query="handleTableQuery">
	</VuTable>
</template>

<script setup>
	import message from '@/utils/message.js';
	import cache from '@/utils/cache.js';
	import useService from '@/services/index.js';
	import { getDictLabel } from '@/utils/common.js';
	
	const router = useRouter()
	
	const tableRef= ref()
	const tableLoading = ref(false)
    const tableData = ref([])
	const total = ref(0)
	const contentStatusOpts = ref([])
	cache.dict('content_status').load().then(dataList => {
		contentStatusOpts.value = dataList
	})
	
	const searchFields = reactive([
		{ label: '标题', name: 'title' },
		{ label: '作者', name: 'author' },
		{ label: '状态', name: 'status', type: 'select', 
			options: contentStatusOpts, 
			valueKey: 'key',
		}
	])
	
    const tableColumns = reactive([
		{ label: '排序', prop: 'sort', type: 'number', width: '55px',
			config: {
				controls: false, style: 'width: 50px;', size: 'small'
			}
		},
        { label: '标题', prop: 'title' },
		{ label: '作者', prop: 'author', width: '100px' },
        { label: '封面', prop: 'cover_url', type: 'image' },
		{ label: '阅读数', prop: 'read_num', width: '70px' },
		{ label: '收藏数', prop: 'fav_num', width: '70px' },
        { label: '原创', prop: 'original', width: '60px' },
	    { label: '状态', prop: 'status', width: '100px' , type: 'tag',
			formatter: (row) => {
				return getDictLabel(contentStatusOpts.value, row['status']);
			},
			config: {
				type: (row) => {
					return row['status'] == '1' ? 'success' : ''
				}
			}
		},
		{ label: '发表日期', prop: 'create_time', width: '160px' }
    ])
	
	const rowEditBtnProps = reactive({
		disabled: (row) => {
			return row['status'] == '1'
		}
	})
	
	const rowActionButtons = reactive([
		{ name: 'unpublish', label: '撤销', type: 'warning', icon: 'Remove' ,
			confirm: true,
			confirmText: '是否确认撤销该条记录？',
			click: (row) => {
				useService('content').update({
					id: row.id,
					status: 0
				}).then(res => {
					if(res.code === 200) {
						message('成功提示', '内容撤销成功！').notify('success');
						tableRef.value.reload()
					}
				})
			}
		},
		{ name: 'publish', label: '发布', type: 'success', icon: 'Promotion',
			confirm: true,
			confirmText: '是否确认发布该条记录？',
			click: (row) => {
				useService('content').update({
					id: row.id,
					status: 1
				}).then(res => {
					if(res.code === 200) {
						message('成功提示', '内容发布成功！').notify('success');
						tableRef.value.reload()
					}
				})
			}
		}
	])
	
	const handleRowActionButton = (row, btn) => {
		if(btn.name === 'publish') {
			return row['status'] == 0
		}
		if(btn.name === 'unpublish') {
			return row['status'] == 1
		}
		return true
	}
	
    const handleTableQuery = (q) => {
		tableLoading.value = true
		useService('content').list(q).then(res => {
			tableLoading.value = false
			if(res.code === 200) {
				tableData.value = res.data.list
				total.value = res.data.total
			}
		})
	}
	
	const handleRowCreateEdit = (row) => {
		if(row) {
			return router.push(`edit/${row.id}`)
		}
		router.push('create')
	}
</script>

<style lang="scss" scoped>
</style>