<template>
	<VuTable ref="tableRef"
		:columns="tableColumns" 
		title="内容分类"
		:searchFields="searchFields"
		:editorFields="editorFields"
		:editorRules="editorRules"
		:total="total" 
		:allowCreate="true"
		:loading="tableLoading"
		:data="tableData"
		:selectable="true"
		:get="handleGet"
		@create="handleCreate"
		@update="handleUpdate"
		@query="handleTableQuery">
	</VuTable>
</template>

<script setup>
	import message from '@/utils/message.js';
	import cache from '@/utils/cache.js';
	import useService from '@/services/index.js'; 
	
	const router = useRouter()
	
	const tableRef= ref()
	const tableLoading = ref(false)
	const tableData = ref([])
	const total = ref(0)
	
	const searchFields = reactive([
		{ label: '标题', name: 'title' }
	])
	
	const tableColumns = reactive([
		{ label: '排序', prop: 'sort', type: 'number', width: '55px',
			config: {
				controls: false, style: 'width: 50px;', size: 'small'
			}
		},
	    { label: '标题', prop: 'title' },
		{ label: '关键字', prop: 'keywords' },
		{ label: '发表日期', prop: 'create_time', width: '160px' }
	])
	
	const editorFields = reactive([
		{ name: 'title', label: '标题' },
		{ name: 'url_alias', label: '链接别名', style: 'width:100%',
			tips: '有助于SEO优化的友好地址，由字母、数字、下划线（_）、连接符（-）等组成' ,
		},
		{ name: 'keywords', label: '关键字', type: 'tag-input', addable: true },
		{ name: 'cover_url', label: '封面地址' },
		{ name: 'description', label: '描述', type: 'textarea' }
	])
	
	const editorRules = reactive({
		title: { required: true, message: '标题必填！' },
		url_alias: { pattern: /(\w|-|_)+/, message: '格式不正确！'}
	})
	
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
		useService('content_category').list(q).then(res => {
			tableLoading.value = false
			if(res.code === 200) {
				tableData.value = res.data.list
				total.value = res.data.total
			}
		})
	}
	
	const handleGet = (id) => {
		return useService('content_category').find({ id }).then(res => {
			const data = res.data || {}
			if(!data.keywords) {
				data.keywords = []
			}
			return data;
		})
	}
	
	const handleCreate = (formData, { visible }) => {
		useService('content_category').create(formData).then(res => {
			if(res.code === 200) {
				message('成功提示', '新增内容分类成功！').notify('success');
				visible.value = false
				tableRef.value.reload()
			}
		})
	}
	
	const handleUpdate = (formData, { visible }) => {
		useService('content_category').update(formData).then(res => {
			if(res.code === 200) {
				message('成功提示', '编辑内容分类成功！').notify('success');
				visible.value = false
				tableRef.value.reload()
			}
		})
	}
</script>

<style lang="scss" scoped>
</style>