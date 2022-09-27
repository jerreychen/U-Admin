<template>
	<VuTable ref="tableRef"
		:columns="tableColumns" 
		title="字典"
		@query="handleTableQuery"
		:treeProps="{ children: 'children' }"
		:pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
		:total="total"
		:allowCreate="true"
		:rowActionButtons="actionButtons"
		:rowActionButton="rowActionButton"
		:allowView="false"
		:data="tableData"
		:editorFields="editorFields"
		:editorRules="editorRules"
		:get="getDictItem"
		@create="handleCreateDict"
		@update="handleUpdateDict"
		:loading="tableLoading"></VuTable>
</template>

<script setup>
	import message from '@/utils/message.js';
	import { getObjectProp } from '@/utils/common.js';
	import useService from '@/services/index.js';
	import { getDictTree, getDictGroupList } from '@/services/app.js'
	
	const tableRef = ref(null)
	const tableLoading = ref(false)
	const tableData = ref([])
	const total = ref(0)
	const tableColumns = reactive([
		{ prop: 'name', label: '字典（组）名称', width: '250px',
			formatter(row) { 
				return row['parent_id'] ? row['label'] : `${row['label']}(${row['name']})`
			} 
		},
		{ prop: 'key', label: '字典值', width: '150px',
			formatter(row) { 
				return row['parent_id'] ? row['key'] : '-'
			}  
		},
		{ prop: 'description', label: '描述' },
		{ prop: 'sort', label: '排序', type: 'number', width: '55px',
			config: {
				controls: false,
				style: 'width: 50px;',
				size: 'small',
				change(row) {
					updateDict({ id: row['id'], sort: row['sort'] }).then(res => {
						if(res.code === 200) {
							message('成功提示', '排序更新成功').notify('success')
							tableRef.value.reload()
						}
					})
				}
			}
		}
	])
	
	const actionButtons = reactive([
		{ name: 'create', label: '新增', type: 'primary', icon: 'Plus', 
			click(row) {
				tableRef.value.create({ dict_type: '1', parent_id: row['id']})
			}
		}
	])
	
	const rowActionButton = (row, btn) => {
		if(btn.name === 'create') {
			return row.parent_id === 0
		}
		return true;
	}
	
	const dictGroupsOpts = ref([])
	const loadGroups = () => {
		getDictGroupList().then(res => {
			if(res.code === 200) {
				dictGroupsOpts.value = res.data
			}
		})
	}
	
	const editorFields = reactive([
		{ name: 'dict_type', label: '字典类型', type: 'radio-button',
			options: [
				{ value: '0', label: '字典组' },
				{ value: '1', label: '字典项'}
			],
			hidden: (v, d) => {
				return d['id'] > 0;
			}
		},
		{ name: 'parent_id', label: '字典组', type: 'select', 
			options: dictGroupsOpts, 
			valueKey: 'id',
			labelKey: 'label',
			hidden: (v, d) => {
				return d['dict_type'] != 1
			}
		},
		{ name: 'label', label: '字典名' },
		{ name: 'key', label: '字典值' },
		{ name: 'description', label: '描述', type: 'textarea' }
	])
	
	const editorRules = reactive({
		dict_type: { required: true, message: '请选择字典类型！' },
		parent_id: { required: true, message: '请选择字典组！' },
		label: { required: true, message: '字典名必填！' },
		key: [
			{ required: true, message: '字典值必填！' },
			{ pattern: /^(\w|-|_)+$/, message: '由数字、字母和下划线（_）组成，2位及以上长度的字符串！'}
		]
	})
	
	const getDictItem = (id) => {
		return useService('dict').get({ id }).then(res => {
			const item = res.data || {}
			item.dict_type = !!item.parent_id ? '1' : '0'
			return item;
		})
	}
	
	const handleCreateDict = (formValue, { visible }) => {
		if(formValue.dict_type == '0') {
			formValue.parent_id = 0;
			formValue.name = formValue.key;
		}
		else {
			const group = dictGroupsOpts.value.findByKeyValue('id', formValue.parent_id);
			formValue.name = getObjectProp(group, 'name' );
		}
		useService('dict').create(formValue).then(res => {
			if(res.code === 200) {
				message('成功提示', '新增字典成功！').notify('success');
				visible.value = false;
				tableRef.value.reload()
				if(formValue.dict_type == '0') {
					loadGroups()
				}
			}
		})
	}
	
	const handleUpdateDict = (formValue, { visible }) => {
		if(formValue.parent_id) {
			const group = dictGroupsOpts.value.findByKeyValue('id', formValue.parent_id);
			formValue.name = getObjectProp(group, 'name' );
		}
		else {
			formValue.name = formValue.key;
		}
		useService('dict').update(formValue).then(res => {
			if(res.code === 200) {
				message('成功提示', '编辑字典成功！').notify('success');
				visible.value = false;
				tableRef.value.reload()
				if(formValue.dict_type == '0') {
					loadGroups()
				}
			}
		})
	}
	
	const handleTableQuery = (q) => {
		tableLoading.value = true;
		getDictTree(q).then(res => {
			tableLoading.value = false;
			if(res.code === 200) {
				tableData.value = res.data.list
				total.value = res.data.total
			}
		})
	}
	
	onMounted(() => {
		loadGroups()
	})
</script>

<style>
</style>