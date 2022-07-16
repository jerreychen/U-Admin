<template>
	<div class="u-table-search"
	    :class="{
	        'u-table-search_show': searchFormVisible,
	        'u-table-search_hidden': !searchFormVisible
	    }"
	    v-if="searchFields && searchFields.length > 0">
	    <VuFormBox :fields="searchFields" 
			:value="searchFormValue"
	        :inline="true"
	        :showMessage="false" 
			:labelWidth="labelWidth"
			:showLabel="showLabel"
	        confirmButtonIcon="Search"
	        @submit="handleSearch"
			@cancel="handleResetSearch"
	        confirmButtonText="搜索"
	        cancelButtonText="重置">
			<template #buttonLeft>
				<el-link v-if="showMore" type="primary" :icon="moreShowed ? 'ArrowUp' : 'ArrowDown'" style="margin-left: .75rem;" @click="handleShowmoreClick">
					{{moreShowed ? '收起' : '展开'}}
				</el-link>
			</template>
		</VuFormBox>
	</div>
    
	<div class="u-table-wrapper" v-loading="loading">
        <div class="d-flex space-between margin-bottom-2">
            <div>
                <el-button type="success" icon="Plus" :title="`新增${title}记录`" v-if="allowCreate" @click="handleNewRecord()">新增{{title}}</el-button>
                <el-popconfirm 
					confirm-button-text="确定"
					cancel-button-text="放弃"
					@confirm="handleBatchDelete(selectedRows)"
					:title="`确定要批量删除选中的 ${selectedRows.length} 条记录？`" v-if="selectable && allowDelete">
                    <template #reference>
                        <el-button type="danger" icon="Delete" title="批量删除" :disabled="!selectedRows.length">批量删除</el-button>
                    </template>
                </el-popconfirm>
				<slot name="batchButtons"></slot>
				<el-button icon="Upload" title="导入数据" v-if="allowImport" @click="handleImport">数据导入</el-button>
            </div>
            <div class="align-right">
                <el-button circle icon="Search" :title="`数据搜索${searchFormVisible ? '收起' : '展开'}`" @click="handleToggleSearch" v-if="allowSearch && searchFields && searchFields.length > 0"></el-button>
				<el-button circle icon="Refresh" title="数据刷新" @click="handleReloadSearch" v-if="allowRefresh"></el-button>
                <el-button circle icon="Download" title="导出数据" @click="$emit('export')" v-if="allowExport"></el-button>
				<el-button circle icon="Printer" title="打印表格" @click="$emit('print')" v-if="allowPrint"></el-button>
                <el-popover trigger="click" v-if="allowFilter">
                    <template #reference>
                        <el-button circle icon="Filter" title="筛选列"></el-button>
                    </template>
                    <el-checkbox-group @change="handleColumnChange" v-model="checkedColumns">
                        <el-checkbox
                            v-for="(col, idx) in columns"
                            :label="col.prop"
                            :disabled="!!col.fixed"
                            :key="`column-check-${idx}`">
                            {{ col.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-popover>
            </div>
        </div>
        <slot name="tabs"></slot>
        <el-table ref="tableRef"
			class="u-table"
            :highlight-current-row="true"
            header-cell-class-name="u-table_header-cell"
            :border="border"
            :data="data"
            :fit="true"
            :show-overflow-tooltip="true"
            empty-text="暂时没有数据"
            table-layout="auto"
			:indent="indent"
			:tree-props="treeProps"
			:row-key="rowKey"
			:lazy="lazy && !!lazyQuery"
			:load="lazyQuery"
            @cell-click="cellClick"
            @cell-dblclick="cellDbClick"
            @row-click="rowClick"
            @row-dblclick="rowDbClick"
            @selection-change="handleSelectionChange">
            <el-table-column 
                type="selection" 
                width="35px"
                fixed
                :selectable="rowSelectable" 
                v-if="selectable">
            </el-table-column>
			
			<el-table-column
				type="index"
				width="55px"
				align="center"
				label="序号"
				fixed
				v-if="indexable"></el-table-column>
             
			<el-table-column type="expand" v-if="expandable">
				<template #default="props">
					<slot name="expandContent" :item="props.row"></slot>
				</template>
			</el-table-column>
			
			<template v-for="(col, index) in filteredColumns" :key="`u-table-column-${index}`">
				
				<el-table-column v-if="col.type"
					:label="col.label"
					:style="col.style"
					:prop="col.prop"
					:fixed="col.fixed"
					:width="col.width"
					:resizable="col.resizable || false"
					:align="col.align"
					:header-align="col.headerAlign">
					<template #default="scope">
						<VuTemplateColumn 
							:type="col.type" 
							:index="index" 
							:config="col.config" 
							:prop="col.prop" 
							:formatter="col.formatter"
							:data="scope.row">
						</VuTemplateColumn>
					</template>
				</el-table-column>
				
				<el-table-column v-else
					:label="col.label"
					:style="col.style"
					:prop="col.prop"
					:fixed="col.fixed"
					:width="col.width"
					:resizable="col.resizable || false"
					:formatter="col.formatter"
					:align="col.align"
					:header-align="col.headerAlign">
				</el-table-column>
					
            </template>
			
            <el-table-column 
                label="操作" 
                align="center" 
                fixed="right"
                :width="`${rowActionColumnWidth || actionButtons.length * 56}px`"
                v-if="!!actionButtons.length">
                <template #default="scope">
                    <div class="row-action-buttons d-flex row middle" :class="{ 'center': rowActionCenter }">
						<template v-for="(btn, btnIndex) in actionButtons" :key="`u-table-action-button-${btnIndex}`">
							<template v-if="!rowActionButton || rowActionButton(scope.row, btn) !== false">
								<el-popconfirm 
									v-if="btn.confirm"
									confirm-button-text="确定"
									cancel-button-text="放弃"
									:disabled="isFunction(btn.disabled) ? btn.disabled(scope.row) : btn.disabled"
									@confirm="isFunction(btn.click) ? btn.click(scope.row) : btn.emit && $emit(btn.emit, scope.row)"
									:title="btn.confirmText || '是否确定该操作？'">
									<template #reference>
										<el-link
											class="padding-x-1"
											:type="btn.type"
											:icon="btn.icon"
											:disabled="isFunction(btn.disabled) ? btn.disabled(scope.row) : btn.disabled"
											:underline="false">
											{{isFunction(btn.label) ? btn.label(scope.row) : btn.label}}
										</el-link>
									</template>
								</el-popconfirm>
								<el-link v-else
									class="padding-x-1"
									:type="btn.type"
									:icon="btn.icon"
									@click="isFunction(btn.click) ? btn.click(scope.row) : btn.emit && $emit(btn.emit, scope.row)"
									:disabled="isFunction(btn.disabled) ? btn.disabled(scope.row) : btn.disabled"
									:underline="false">
								{{isFunction(btn.label) ? btn.label(scope.row) : btn.label}}
								</el-link>
							</template>
						</template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="d-flex row middle space-between margin-top-2" v-if="total !== undefined && total > 0">
            <div class="">总共{{ total }}条记录，第{{ currentPage }}页/共{{ totalPages }}页</div>
            <el-pagination
                class="u-pagination"
                background 
				:small="pagerSmall"
				:pager-count="pagerCount"
                :page-sizes="[10, 15, 20, 30, 50]"
                layout="sizes, prev, pager, next, jumper"
                prev-text="上一页"
                next-text="下一页"
				:default-current-page="0"
                v-model:page-size="searchFormValue[pageSizeName]"
                v-model:current-page="currentPage"
                :total="total"
				@size-change="handlePageSizeChanged"
                @current-change="handleCurrentPageChanged" />
        </div>
    </div>

	<VuDialog ref="importFormRef"
		:title="`${title}数据导入`"
		:showHelp="true"
		@cancel="handleImportCancel"
		@confirm="handleImportSubmit"
		confirmText="确定导入"
		:visible="importDialogVisible"
		 v-if="allowImport">
		<VuUpload 
			ref="importUploader"
			:drag="true" 
			:name="importName"
			:limit="1"
			:action="importUrl" 
			:previewable="false"
			:autoUpload="false"
			accept=".xls,.xlsx"
			tips="请先下载模板文件并填写好数据后进行上传. "
			:onUploaded="handleImportSuccess"
			class="imoprt-file-uploader"></VuUpload>
			
		<template #help v-if="importTemplateUrl">
			<el-link :href="importTemplateUrl" type="primary" target="_blank" icon="Download">下载模板文件</el-link>
		</template>
	</VuDialog>
	
	<VuFormDialog
		ref="editorRef" 
		:title="editorTitle"
		:visible="editorVisible" 
		:width="editorWidth"
		:fields="editorFields" 
		:rules="editorRules"
		:labelWidth="editorLabelWidth"
		:showTips="true"
		:inline="editorInline"
		@cancel="handleEditorCancel"
		@submit="handleEditorSubmit"
		:value="editorValue"
		v-if="editorFields && editorFields.length > 0">
	</VuFormDialog>
</template>

<script setup>
	import message from '/@/utils/message.js';
	import { getObjectProp } from '/@/utils/common.js';
	import VuTemplateColumn from './VuTemplateColumn.vue';
	import VuUpload from '../VuForm/VuUpload.vue';

	const tableRef = ref()
	const importFormRef = ref()
	const editorRef = ref()
	const editorValue = ref({ })
	const editorVisible = ref(false)
	const editMode = ref(false)
	const editorTitle = ref('')
	const importUploader = ref()
	const importDialogVisible = ref(false)
	const searchFormValue = ref({ })

	const props = defineProps( {
		title: { type: String, default: '' },
		
		loading: { tyep: Boolean, default: false },
		border: { type: Boolean, default: false },
		columns: { type: Array, required: true },
		data: { type: Array, default: () => ([]) },
		
		rowKey: { type: String, default: 'id' },
		lazy: { type: Boolean, default: false },
		indent: { type: Number, default: 16 },
		expandable: { type: Boolean, default: false },
		indexable: { type: Boolean, default: false },
		selectable: { type: Boolean, default: false },
		
		searchFields: { type: Array },
		editorFields: { type: Array },
		editorRules: { type: Object },
		showLabel: { type: Boolean, default: true },
		labelWidth: { type: String, default: '65px' },
		editorWidth: { type: [Number, String], default: '50vw' },
		editorInline: { type: Boolean, default: false },
		editorLabelWidth: { type: String, default: '100px' },
		
		pageIndex: { type: Number, default: 1 },
		pageSize: { type: Number, default: 20 },
		total: { type: Number },
		pagerCount: { type: Number, default: 5 },
		pagerSmall: { type: Boolean, default: false },
		
		treeProps: { type: Object },
		pagerProps: { type: Object },
		importProps: { type: Object },
		
		allowImport: { type: Boolean, default: false },
		allowCreate: { type: Boolean, default: false },
		allowEdit: { type: Boolean, default: true },
		allowView: { type: Boolean, default: false },
		allowDelete: { type: Boolean, default: true },
		
		allowSearch: { type: Boolean, default: false },
		allowRefresh: { type: Boolean, default: false },
		allowExport: { type: Boolean, default: false },
		allowFilter: { type: Boolean, default: false },
		allowPrint: { type: Boolean, default: false },
		
		rowActionColumnWidth: { type: Number },
		rowActionCenter: { type: Boolean, default: false },
		rowActionButton: { type: Function },
		rowActionButtons: { type: Array, default: () => ([]) },
		rowViewButtonProps: { type: Object, default: () => ({}) },
		rowEditButtonProps: { type: Object, default: () => ({}) },
		rowDeleteButtonProps: { type: Object, default: () => ({}) },
		
		lazyQuery: { type: Function },
		
		cellClick: { type: Function },
		cellDbClick: { type: Function },
		rowClick: { type: Function },
		rowDbClick: { type: Function },
		rowSelectable: { type: Function },
		get: { type: Function },
		remove: { type: Function }
	})
	
	const emits = defineEmits([
		'create', 'update', 'query', 'reset', 'import', 'export', 'print',
		'batchDelete', 'rowCreate', 'rowSelect', 'rowView', 'rowEdit', 'rowDelete'
	])

	const pageIndexName = ref(computed(() => {
		if(props.pagerProps) {
			return props.pagerProps.pageIndex || 'pageIndex'
		}
		return 'pageIndex'
	}))
	
	const pageSizeName = ref(computed(() => {
		if(props.pagerProps) {
			return props.pagerProps.pageSize || 'pageSize'
		}
		return 'pageSize'
	}))
	
	const { searchFields, columns, allowEdit, allowView, allowDelete } = props
	
	// pageIndex 从1开始
	searchFormValue.value[pageIndexName.value] = props.pageIndex - 1
	searchFormValue.value[pageSizeName.value] = props.pageSize
	
	const currentPage = ref(1)
	
	const importName = computed(() => {
		return getObjectProp(props.importProps, 'name', 'file')
	})
	const importUrl = computed(() => {
		return getObjectProp(props.importProps, 'action', '')
	})
	const importTemplateUrl = computed(() => {
		return getObjectProp(props.importProps, 'template', '')
	})
	
	watch(currentPage, (v) => {
		searchFormValue.value[pageIndexName.value] = v - 1
	})
	const totalPages = ref(computed(() => {
		return Math.ceil(props.total / searchFormValue.value[pageSizeName.value])
	}))
	
	const searchFormVisible = ref(true)
	const selectedRows = ref([])
	const moreShowed = ref(false)
	const flexibleFields = (searchFields || []).filter(field => { return field.hidden != undefined })
	const showMore = ref(computed(() => { return flexibleFields.length > 0 }))
	
	const checkedColumns = ref([])
	columns.map(c => {
		if(!c.hidden) {
			checkedColumns.value.push(c.prop)
		}
	})
	
	const filteredColumns = computed(() => {
		return columns.filter(c=> { return !c.hidden })
	})
	
	// 新增数据
	const handleNewRecord = (data) => {
		if(!props.editorFields || props.editorFields.length === 0) {
			emits('rowCreate');
			return
		}
		editorTitle.value = `新增${props.title}`
		editorValue.value = Object.assign({}, data || {});
		editMode.value = false
		editorVisible.value = true
	}
	// 批量删除
	const handleBatchDelete = (rows) => {
		const ids = rows.map(item => {
			return item[props.rowKey]
		})
		emits('batchDelete', ids, rows);
	}
	// 行编辑事件
	const handleRowEdit = (row) => {
		const id = row[props.rowKey];
		
		if(!props.get || !props.editorFields || props.editorFields.length === 0) {
			emits('rowEdit', row);
			return
		}
		
		editorTitle.value = `编辑${props.title}`
		
		const getFuncRes = props.get.call(null, id);
		if(getFuncRes instanceof Promise) {
			return getFuncRes.then(record => {
				editorValue.value = record
				editMode.value = true
				editorVisible.value = true
			})
		}
		
		editorValue.value = getFuncRes
		editMode.value = true
		editorVisible.value = true
	}
	// 编辑框关闭
	const handleEditorCancel = () => {
		editorVisible.value = false
	}
	// 数据提交
	const handleEditorSubmit = (formValue) => {
		emits(editMode.value ? 'update' : 'create', formValue, { visible: editorVisible});
	}
	
	const getButtonConfig = (propName, iconName, emitName) => {
		let btnProps = { label: '按钮', type: 'primary' };
		
		switch(propName) {
			case 'view':
				btnProps = Object.assign({ 
					label: '详情', 
					type: 'default' ,
				}, props.rowViewButtonProps);
			break;
			case 'edit':
				btnProps = Object.assign({ 
					label: '编辑', 
					type: 'primary', 
					click: handleRowEdit ,
				}, props.rowEditButtonProps);
			break;
			case 'delete':
				btnProps = Object.assign({ 
					label: '删除', 
					type: 'danger',
					confirm: true, 
					confirmText: '是否确定要删除该条记录？' ,
				}, props.rowDeleteButtonProps);
			break;
		}
		
		return { 
			label: btnProps.label, 
			type: btnProps.type,
			icon: iconName, 
			emit: emitName,
			name: propName,
			click: btnProps.click,
			confirm: btnProps.confirm,
			disabled: btnProps.disabled
		}
	}
	const actionButtons = computed(() => {
		let buttons = [...props.rowActionButtons];
		
		if(allowView) {
			buttons.push(getButtonConfig('view', 'View', 'rowView'))
		}
		if(allowEdit) {
			buttons.push(getButtonConfig('edit', 'Edit', 'rowEdit'))
		}
		if(allowDelete) {
			buttons.push(getButtonConfig('delete', 'Delete', 'rowDelete'))
		}
		return buttons
	})
	
	// 列隐藏与显示事件
	const handleColumnChange = (vals) => {
		columns.map(c => {
			c.hidden = vals.indexOf(c.prop) < 0
			return c;
		})
		tableRef.value.doLayout()
	}
	// 表格行选择事件
	const handleSelectionChange = (selection) => {
		selectedRows.value = selection
		emits('rowSelect', selection)
	}
	// 分页事件：条数改变
	const handlePageSizeChanged = (size) => {
		searchFormValue.value[pageSizeName.value] = size
		emits('query', searchFormValue.value)
	}
	// 分页事件：页码改变
	const handleCurrentPageChanged = (page) => {
		searchFormValue.value[pageIndexName.value] = page - 1
		emits('query', searchFormValue.value)
	}
	// 搜索事件
	const handleSearch = (formValue) => {
		currentPage.value = 1
		formValue[pageIndexName.value] = currentPage.value  - 1
		emits('query', formValue)
	}
	// 搜索重置事件
	const handleResetSearch = () => {
		emits('reset', searchFormValue.value);
		handleReloadSearch()
	}
	// 刷新事件
	const handleReloadSearch = (q) => {
		nextTick(() => {
			handleSearch(Object.assign(searchFormValue.value, q || {}))
		})
	}
	// 搜索框显示/隐藏
	const handleToggleSearch = () => {
		searchFormVisible.value = !searchFormVisible.value
	}
	// 搜索条件显示/隐藏更多
	const handleShowmoreClick = () => {
		moreShowed.value = !moreShowed.value
		
		searchFields.forEach(field => {
			if(field.hidden != undefined) {
				field.hidden = !moreShowed.value
			}
		})
	}
	// 导入框打开
	const handleImport = () => {
		importDialogVisible.value = true
	}
	// 导入框关闭
	const handleImportCancel = () => {
		importDialogVisible.value = false
	}
	// 导入文件上传
	const handleImportSubmit = () => {
		importUploader.value.upload()
	}
	// 导入文件成功
	const handleImportSuccess = (res) => {
		if(res.code === 0) {
			message('成功提示', '数据文件上传成功，请等待导入完成！').notify('success')
			importDialogVisible.value = false
		}
	}
	
	onMounted(() => {
	 	emits('query', searchFormValue.value)
	})
	
	defineExpose({
		doLayout: () => { tableRef.value.doLayout(); },
		editorValue: editorValue,
		reload: handleReloadSearch,
		create: handleNewRecord
	})
</script>

<style scoped lang="scss">
	
	.u-table-search {
		&.u-table-search_show {
			display: block;
		}
		&.u-table-search_hidden {
			display: none;
		}
		
		:deep(.el-form-item) {
			margin-bottom: .5rem;
			margin-top: .5rem;
		}
	}
	
    .u-table-wrapper {
		background-color: $white;
		padding: 15px;
		
        .u-pagination {
            :deep(.btn-prev), :deep(.btn-next) {
                padding: 0 .5rem;
            }
        }
    }
	
	.imoprt-file-uploader {
		
		:deep(.el-upload-list) {
			width: 100%;
			
			.el-upload {
				width: 100%;
			}
		}
	}
	
	.u-table {
		.row-action-buttons {
			margin: 0px -0.75rem;
		}
	}
</style>