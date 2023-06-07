<template>
	<VuTable
		ref="tableRef" 
		title="消息"
		:loading="tableLoading"
		editorWidth="960px"
		:editorFields="editorFields"
		:total="total"
		:allowCreate="true"
		:pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
		:columns="tableColumns"
		:rowActionButtons="rowActionButtons"
		:rowActionButton="handleRowActionButton"
		:rowActionColumnWidth="150"
		:get="handleGet"
		@create="handleCreate"
		@update="handleUpdate"
		@query="handleTableQuery"
		:data="tableData">
	</VuTable>
</template>

<script setup>
	import cache from '@/utils/cache.js';
	import message from '@/utils/message.js';
	import useService from '@/services/index.js'; 
	import { getDictLabel } from '@/utils/common.js';
	
	const tableRef = ref()
	const tableData = ref([])
	const tableLoading = ref(false)
	const total = ref(0)
	
	const noticeTypeOpts = ref([])
	cache.dict('notice_type').load().then(dataList => {
		noticeTypeOpts.value = dataList
	})
	const contentStatusOpts = ref([])
	cache.dict('content_status').load().then(dataList => {
		contentStatusOpts.value = dataList
	})
	
	const tableColumns = reactive([
		{ prop: 'title', label: '标题' },
		{ prop: 'type_id', label: '分类', width: '120px', 
			formatter(row) {
				return getDictLabel(noticeTypeOpts.value, row['type_id'])
			}
		},
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
		{ prop: 'create_time', label: '创建时间', width: '160px' }
	])
	
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
	
	const editorFields = reactive([
		{ name: 'title', label: '标题' },
		{ name: 'type_id', label: '类型', type: 'select',
			options: noticeTypeOpts,
			valueFormatter: (v) => { return Number(v); },
			valueKey: 'key'
		},
		{ name: 'receiver_ids', label: '接收人' },
		{ name: 'description', label: '简介', type: 'textarea' },
		{ name: 'content', label: '内容', type: 'editor' }
	])
	
	const handleGet = (id) => {
		return useService('notice').find({ id }).then(res => {
			return res.data || {}
		})
	}
	
	const handleCreate = (formData, { visible }) => {
		useService('notice').create(formData).then(res => {
			if(res.code === 200) {
				message('成功提示', '新建通知公告成功！').notify('success');
				visible.value = false
				tableRef.value.reload()
			}
		})
	}
	
	const handleUpdate = (formData, { visible }) => {
		useService('notice').update(formData).then(res => {
			if(res.code === 200) {
				message('成功提示', '编辑通知公告成功！').notify('success');
				visible.value = false
				tableRef.value.reload()
			}
		})
	}
	
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
		tableLoading.value = true;
		useService('notice').list(q).then(res => {
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