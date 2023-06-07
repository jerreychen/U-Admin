<template>
	<VuTable ref="tableRef"
		title="菜单"
		:allowCreate="true"
		:columns="tableColumns" 
		@query="handleTableQuery"
		:treeProps="{ children: 'children' }"
		:editorFields="formFields"
		:editorRules="editorRules"
		:editorInline="true"
		:allowView="false"
		:data="tableData"
		:get="getDataRecord"
		@create="handleCreateMenu"
		@update="handleUpdateMenu"
		:rowActionButtons="actionButtons"
		:loading="tableLoading"></VuTable>
</template>

<script setup>
	import messsage from '@/utils/message.js';
	import cache from '@/utils/cache.js';
	import Enums from '@/utils/enums.js';
	import useService from '@/services/index.js';
	import { getMenuTree, updateVisible } from '@/services/app.js';
	import { getMenuUrlByTree } from '@/utils/common.js';
	
	const store = useStore()
	
	const menuType = [
		{ value: '0', label: '菜单组', type: '' }, 
		{ value: '1', label: '超链接', type: 'success' },
		{ value: '2', label: '按钮', type: 'info' }
	];
	
	const tableRef = ref()
	const tableLoading = ref(false)
	const tableData = ref([])
	const menuTreeList = ref(store.getters.menuList)
	
	const tableColumns = reactive([
		{ prop: 'title', label: '菜单名称', width: '150px' },
		{ prop: 'icon', label: '图标', width: '55px', align: 'center', type: 'el-icon' },
		{ prop: 'url', label: 'URL地址', 
			formatter(row) {
				if(row.menu_type !== 1) {
					return '-';
				}
				
				let urlPath = getMenuUrlByTree(menuTreeList.value, row['id']) || []
				return  '/' + urlPath.join('/')
			},
			width: '200px'
		},
		{ prop: 'path', label: '组件地址' },
		{ prop: 'menu_type', label: '菜单类型', align: 'center', width: '80px', 
			formatter(row) {
				return menuType[row['menu_type']].label
			},
			type: 'tag',
			config: {
				type: (row) => {
					return menuType[row['menu_type']].type
				}
			}
		},
		{ prop: 'hidden', label: '显/隐', width: '65px', type: 'switch',
			config: {
				activeValue: 0,
				inactiveValue: 1,
				activeText: '显',
				inactiveText: '隐',
				inlinePrompt: true,
				disabled: false,
				change(row) {
					updateVisible({ id: row['id'], hidden: row['hidden']}).then(res => {
						if(res.code === 200) {
							messsage('成功提示', '显示/隐藏更新成功').notify('success')
							tableRef.value.reload()
							store.dispatch('app/refreshMenu')
						}
					})
				}
			}
		},
		{ prop: 'sort', label: '排序', type: 'number', width: '55px',
			config: {
				controls: false,
				style: 'width: 50px;',
				size: 'small',
				change(row) {
					useService('menu').update({ id: row['id'], sort: row['sort'] }).then(res => {
						if(res.code === 200) {
							messsage('成功提示', '排序更新成功').notify('success')
							tableRef.value.reload()
							store.dispatch('app/refreshMenu')
						}
					})
				}
			}
		}
	])
	
	const actionButtons = reactive([
		{ name: 'create', label: '新增', type: 'primary', icon: 'Plus', 
			click(row) {
				tableRef.value.create({ parent_id: row['id']})
			}
		}
	])
	
	const menuTreeSelectOpts = computed(() => {
		return [{ id: 0, title: '无父菜单' }].concat(tableData.value)
	})
	
	const formFields = reactive([
		{ name: 'menu_type', label: '菜单类型', type: 'radio-button', style: 'margin-right:0;width: 50%',
			options: menuType
		},
		{ name: 'parent_id', label: '父菜单', type: 'tree-select' , style: 'margin-right:0;width: 100%',
			options: menuTreeSelectOpts,
			nodeKey: 'id',
			checkStrictly: true,
			props: {
				children: 'children', 
				label: 'title',
				disabled: function(data, node) {
					const { menu_type } = tableRef.value.editorValue
					return data.menu_type === 2
						|| menu_type < 2 && data.menu_type === 1
						|| menu_type === 2 && data.menu_type === 0;
				}
			}
		},
		{ name: 'name', label: '菜单编号', style: 'margin-right:0;width: 50%'},
		{ name: 'icon', label: '菜单图标', type: 'icon-list', style: 'margin-right:0;width: 50%' },
		{ name: 'title', label: '菜单名称', style: 'margin-right:0;width: 100%' },
		{ name: 'description', label: '描述', type: 'textarea', style: 'margin-right:0;width: 100%' },
		{ name: 'url', label: 'URL 名称', tips: '地址不可以【/】开头', 
			style: 'margin-right:0;width: 100%',
			hidden: (v, d) => {
				return d.menu_type == 2
			}
		},
		{ name: 'query', label: '查询参数', placeholder: '请输入查询参数：{ "a": "va", ... } 格式',
			tips: '查询参数将以 ?a=va&... 形式跟在地址后',
			style: 'margin-right:0;width: 100%',
			hidden: (v, d) => {
				return d.menu_type != 1
			}
		},
		{ name: 'path', label: '组件地址', tips: '组件地址必须以【/pages/】开头【.vue】结尾', 
			style: 'margin-right:0;width: 100%',
			hidden: (v, d) => {
				return d.menu_type != 1
			}
		},
		{ name: 'hidden', label: '隐藏/显示', type: 'switch', style:'margin-right:0;width:30%;',
			activeValue: 0,
			inactiveValue: 1,
			activeText: '显',
			inactiveText: '隐',
			inlinePrompt: true,
			disabled: false
		},
		{ name: 'link_type', label: '是否外链', type: 'switch', style:'margin-right:0;width:30%;',
			activeValue: 1,
			inactiveValue: 0,
			activeText: '是',
			inactiveText: '否',
			inlinePrompt: true,
			disabled: false,
			hidden: (v, d) => {
				return d.menu_type != 1
			}
		},
		{ name: 'sort', label: '排序号', type: 'number', controls: false, 
			style:'margin-right:0;width:40%;' ,
		}
	])
	
	const editorRules = reactive({
		menu_type: { required: true, message: '菜单类型必选！'},
		name: [
			{ required: true, message: '菜单编号必填！' },
			{ pattern: /^(\w|-|_)+$/, message: '由数字、字母和下划线（_）组成，2位及以上长度的字符串！'}
		],
		title: { required: true, message: '菜单名称必填！' },
		url: [
			{ required: true, message: 'Url名称必填！'},
			{ pattern: /^[^\/](\w|_)+/, message: '不以“/”符号开头，由数字、字母和下划线（_）组成，2位及以上长度的字符串！'}
		],
		path: [
			{ pattern: /^\/pages\/(\w|_|-|\/)+\.vue$/i, message: '组件地址必须以【/pages/】开头【.vue】结尾！'}
		]
	})
	
	const getDataRecord = (id) => {
		return useService('menu').find({id}).then(res => {
			return res.data || {};
		})
	}
	
	const handleCreateMenu = (formData, { visible }) => {
		useService('menu').create(formData).then(res => {
			if(res.code === 200) {
				messsage('成功提示', '新增菜单成功！').notify('success');
				store.dispatch('app/refreshMenu').then(()=>{
					visible.value = false;
					tableRef.value.reload()
				})
			}
		})
	}
	
	const handleUpdateMenu = (formData, { visible }) => {
		useService('menu').update(formData).then(res => {
			if(res.code === 200) {
				messsage('成功提示', '更新菜单成功！').notify('success');
				store.dispatch('app/refreshMenu').then(() =>{
					visible.value = false;
					tableRef.value.reload()
				})
			}
		})
	}
	
	const handleTableQuery = (q) => {
		tableLoading.value = true;
		getMenuTree(q).then(res => {
			tableLoading.value = false
			if(res.code === 200) {
				tableData.value = res.data
			}
		})
	}
</script>

<style>
</style>