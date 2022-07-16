<template>
	<VuTable ref="tableRef"
		:columns="tableColumns" 
		title="行政区"
		:total="total"
		:treeProps="{ hasChildren: 'hasChildren' }"
		:lazy="true"
		:lazyQuery="loadChildrenDataList"
		:allowCreate="true"
		:data="tableData"
		:editorFields="editorFields"
		:editorRules="editorRules"
		:editorInline="true"
		:get="getDistrictItem"
		@query="handleTableQuery"
		@create="handleCreateDistrict"
		@update="handleUpdateDistrict"
		:loading="tableLoading"></VuTable>
</template>

<script setup>
	import message from '/@/utils/message.js';
	import { getObjectProp } from '/@/utils/common.js';
	import useService from '/@/services/index.js';
	import { getDistrictList } from '/@/services/app.js';
	import CitySelect from '/@/pages/components/form/CitySelect.vue';
	
	const router = useRouter()
	
	const loadFuncs = new Map()
	
	const tableRef = ref(null)
	const tableLoading = ref(false)
	const tableData = ref([])
	const total = ref(0)
	const tableColumns = reactive([
		{ prop: 'name', label: '行政名称' },
		{ prop: 'short_name', label: '简写' },
		{ prop: 'code', label: '行政代码' },
		{ prop: 'lng', label: '经度', width: '150px' },
		{ prop: 'lat', label: '纬度', width: '150px' }
	])
	
	const editorFields = reactive([
		{ name: 'parent_ids', label: '上级行政区', class: 'w-100', 
			type: 'component',
			component: markRaw(CitySelect),  // 重要： markRaw，否则报错
			config: {
				props: {
					checkStrictly: true,
				},
			}
		},
		{ name: 'name', label: '行政区名称', class: 'w-100' },
		{ name: 'pinyin', label: '名称拼音', class: 'w-100' },
		{ name: 'code', label: '行政区代码', maxLength: 6, class: 'w-50 margin-right-0'},
		{ name: 'short_name', label: '名称简写', class: 'w-50 margin-right-0' },
		{ name: 'lng', label: '经度', type: 'number', controls: false, class: 'w-50 margin-right-0' },
		{ name: 'lat', label: '纬度', type: 'number', controls: false, class: 'w-50 margin-right-0' },
	])
	
	const editorRules = reactive({
		name: { required: true, message: '行政区名称必填！' },
		code: { required: true, message: '行政区代码必填！' },
	})
	
	const getDistrictItem = (id) => {
		// level: 0 省份，1 市，2 区/县/市
		return useService('district').get({ id }).then(res => {
			const record = res.data || {}
			if(record.lng) {
				record.lng = Number(record.lng)
			}
			if(record.lat) {
				record.lat = Number(record.lat)
			}
			return record
		})
	}
	
	const loadChildrenDataList = (row, node, resolve) => {
		const { level } = node;
		
		loadFuncs.set(row.id, { row, node, resolve })
		
		useService('district').list({
			parentId: row.id, level: level === 0 ? 1 : 2  // TRUE ('' == 0)
		}).then(res => {
			resolve(res.data || [])
		})
	}
	
	const handleCreateDistrict = (formValue, { visible }) => {
		useService('district').create(formValue).then(res => {
			if(res.code === 200) {
				message('成功提示', '新增行政区成功！').notify('success');
				visible.value = false;
				tableRef.value.reload()
			}
		})
	}
	
	const handleUpdateDistrict = (formValue, { visible }) => {
		useService('district').update(formValue).then(res => {
			if(res.code === 200) {
				message('成功提示', '编辑行政区成功！').notify('success');
				visible.value = false;
				const { row, node, resolve } = loadFuncs.get(formValue.parent_id)
				loadChildrenDataList(row, node, resolve);
			}
		})
	}
	
	const handleTableQuery = (q) => {
		tableLoading.value = true;
		getDistrictList(q).then(res => {
			tableLoading.value = false;
			if(res.code === 200) {
				tableData.value = res.data.list
				total.value = res.data.total
			}
		})
	}
</script>

<style>
</style>