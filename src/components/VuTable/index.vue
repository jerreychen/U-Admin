<template>
<div>
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
	        confirmIcon="Search"
	        @submit="handleSearch"
			@cancel="handleResetSearch"
	        confirmText="搜索"
	        cancelText="重置">
			<template #buttonLeft>
				<el-link v-if="showMore" type="primary" :icon="moreShowed ? 'ArrowUp' : 'ArrowDown'" style="margin-left: .75rem;" @click="handleShowmoreClick">
					{{moreShowed ? '收起' : '展开'}}
				</el-link>
			</template>
		</VuFormBox>
	</div>
    
	<div class="u-table-wrapper" v-loading="loading">
        <div class="d-flex space-between margin-bottom-2" v-if="showAction">
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
				<slot name="batchButtons" :rows="selectedRows"></slot>
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
				<slot name="headerButtons"></slot>
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
			@sort-change="handleSortChange"
			:sort-method="sortMethod"
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
				type="index" :index="indexMethod"
				:width="indexColumn.width ?? '55px'"
				:align="indexColumn.align ?? 'center'"
				:label="indexColumn.title ?? '序号'"
				:fixed="indexColumn.fixed ?? true"
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
					:sortable="col.sortable"
					:filters="col.filters"
					:filter-method="col.columnFilter"
					:show-overflow-tooltip="col.overflowTooltip"
					:resizable="col.resizable"
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
					:sortable="col.sortable"
					:filters="col.filters"
					:filter-method="col.columnFilter"
					:show-overflow-tooltip="col.overflowTooltip"
					:resizable="col.resizable"
					:formatter="col.formatter"
					:align="col.align"
					:header-align="col.headerAlign">
				</el-table-column>
					
            </template>
			
            <el-table-column 
                label="操作" 
                align="center" 
                fixed="right"
                :width="`${rowActionColumnWidth || actionButtons.length * (rowActionButtonLabel ? 56 : 25)}px`"
                v-if="showAction && showActionColumn && (!!actionButtons.length || !!rowActionCommands.length)">
                <template #default="scope">
                    <div class="row-action-buttons d-flex middle space-around" 
						:class="{ 
							'center': rowActionCenter,
							'row': !rowActionVertical,
							'column': rowActionVertical
						}">
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
											:title="isFunction(btn.label) ? btn.label(scope.row) : btn.label"
											:icon="btn.icon"
											@click.native.stop=""
											:disabled="isFunction(btn.disabled) ? btn.disabled(scope.row) : btn.disabled"
											:underline="false">
											<template v-if="rowActionButtonLabel">
												{{isFunction(btn.label) ? btn.label(scope.row) : btn.label}}
											</template>
										</el-link>
									</template>
								</el-popconfirm>
								<el-link v-else
									class="padding-x-1"
									:type="btn.type"
									:icon="btn.icon"
									:title="isFunction(btn.label) ? btn.label(scope.row) : btn.label"
									@click.native.stop="isFunction(btn.click) ? btn.click(scope.row) : btn.emit && $emit(btn.emit, scope.row)"
									:disabled="isFunction(btn.disabled) ? btn.disabled(scope.row) : btn.disabled"
									:underline="false">
									<template v-if="rowActionButtonLabel">
										{{isFunction(btn.label) ? btn.label(scope.row) : btn.label}}
									</template>
								</el-link>
							</template>
						</template>
						<template v-if="rowActionCommands.length > 0">
							<el-dropdown placement="left"
								class="margin-left-1"
								@command="handleRowActionCommand" 
								trigger="click">
								<el-link icon="MoreFilled" @click.native.stop="" :underline="false"></el-link>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item
											:icon="item.icon"
											:command="setRowCommand(scope.row, item.command || `command${index}`)"
											:disabled="item.disabled"
											v-for="(item, index) in rowActionCommands"
											:key="index">
											{{item.label}}
										</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="d-flex row middle space-between margin-top-2" v-if="total !== undefined && total > 0">
            <div class="pagination-info">
				<span v-if="pagerShowInfo">总共{{ total }}条记录，第{{ currentPage }}页/共{{ totalPages }}页</span>
			</div>
            <el-pagination
                class="u-pagination"
                :background="pagerBackground"
				:small="pagerSmall"
				:pager-count="pagerCount"
                :page-sizes="pagerSizes"
                :layout="pagerLayout"
				:prev-text="pagerPrevText"
				:next-text="pagerNextText"
				:default-current-page="pagerCurrent"
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
			<el-link :href="importTemplateUrl" type="primary" target="_blank" icon="Download" v-if="importTemplateRemotely">下载模板文件</el-link>
			<el-link @click="handleDownloadFile(importTemplateFileName, importTemplateUrl)" type="primary" target="_blank" icon="Download" v-else>下载模板文件</el-link>
		</template>
	</VuDialog>
	
	<VuFormDialog
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
		v-if="editorFields && editorFields.length > 0 && !drawerForm">
	</VuFormDialog>
	
	<el-drawer v-if="editorFields && editorFields.length > 0 && drawerForm"
		v-model="editorVisible" 
		:title="editorTitle" 
		:size="editorWidth"
		:append-to-body="true"
		:destroy-on-close="true">
		<VuForm
			ref="editorRef"
			:fields="editorFields"
			:rules="editorRules"
			:labelWidth="editorLabelWidth"
			:showTips="true"
			:inline="editorInline"
			@cancel="handleEditorCancel"
			@submit="handleEditorSubmit"
			:value="editorValue">
		</VuForm>
		<template #footer>
			<el-button @click="handleEditorCancel">取消</el-button>
			<el-button type="primary" @click="handleEditorSubmit">保存提交</el-button>
		</template>
	</el-drawer>
</div>
</template>

<script setup>
	import message from '@/utils/message.js';
	import {useDownload} from '@/utils/download.js'
	import { getObjectProp, saveFile } from '@/utils/common.js';
	import VuTemplateColumn from './VuTemplateColumn.vue';
	import VuUpload from '../VuForm/VuUpload.vue';

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
		indexColumn: { type: Object, default: () => ({}) },
		selectable: { type: Boolean, default: false },
		
		searchFields: { type: Array },
		editorFields: { type: Array },
		editorRules: { type: Object },
		editorDefaultValue: { type: Object, default: () => ({}) },
		showLabel: { type: Boolean, default: true },
		labelWidth: { type: String, default: '65px' },
		editorWidth: { type: [Number, String], default: '50vw' },
		editorInline: { type: Boolean, default: false },
		editorLabelWidth: { type: String, default: '100px' },
		
		pageIndex: { type: Number, default: 1 },
		pageSize: { type: Number, default: 20 },
		total: { type: Number },
		pagerCount: { type: Number, default: 5 },
		pagerSmall: { type: Boolean, default: true },
		
		treeProps: { type: Object },
		pagerProps: { type: Object },
		importProps: { type: Object },
		
		showAction: { type: Boolean, default: true },
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
	
		showActionColumn: { type: Boolean, default: true },
		rowActionColumnWidth: { type: Number },
		rowActionVertical: { type: Boolean, default: false },
		rowActionCenter: { type: Boolean, default: false },
		rowActionButton: { type: Function },
		rowActionButtonLabel: { type: Boolean, default: true },
		rowActionButtons: { type: Array, default: () => ([]) },
		rowViewButtonProps: { type: Object, default: () => ({}) },
		rowEditButtonProps: { type: Object, default: () => ({}) },
		rowDeleteButtonProps: { type: Object, default: () => ({}) },
		
		rowActionCommands: { type: Array, default: () => ([]) },
		
		lazyQuery: { type: Function },
		
		cellClick: { type: Function },
		cellDbClick: { type: Function },
		rowClick: { type: Function },
		sortMethod: { type: Function },
		rowDbClick: { type: Function },
		rowSelectable: { type: Function },
		get: { type: Function },
		
		searchValue: { type: Object, default: () => ({}) },
		drawerForm: { type: Boolean, default: false }
	})
	
	const emits = defineEmits([
		'create', 'update', 'query', 'reset', 'import', 'export', 'print', 'beforeOpenEditor',
		'batchDelete', 'rowCommand', 'rowCreate', 'rowSelect', 'rowView', 'rowEdit', 'rowDelete',
		'sortChange'
	])

	const tableRef = ref()
	const editorRef = ref()
	const importFormRef = ref()
	const editorValue = ref(props.editorDefaultValue)
	const editorVisible = ref(false)
	const editMode = ref(false)
	const editorTitle = ref('')
	const importUploader = ref()
	const importDialogVisible = ref(false)
	const searchFormValue = ref(props.searchValue)

	const pagerBackground = computed(() => {
		const { background } = props.pagerProps || {}
		return background || false;
	})
	const pagerSizes = computed(() => {
		const { sizes } = props.pagerProps || {}
		return sizes || [10, 15, 20, 30, 50];
	})
	const pagerPrevText = computed(() => {
		const { prevText } = props.pagerProps || {}
		return prevText || '';
	})
	const pagerNextText = computed(() => {
		const { nextText } = props.pagerProps || {}
		return nextText || '';
	})
	const pagerLayout = computed(() => {
		const { layout } = props.pagerProps || {}
		return layout || 'sizes, prev, pager, next, jumper';
	})
	const pagerCurrent = computed(() => {
		const { current } = props.pagerProps || {}
		return current || 0
	})
	const pagerShowInfo = computed(() => {
		const { showInfo } = props.pagerProps || {}
		return showInfo ?? true
	})
	const pageIndexName = ref(computed(() => {
		const { pageIndex } = props.pagerProps || {}
		return pageIndex || 'pageIndex'
	}))
	const pageSizeName = ref(computed(() => {
		const { pageSize } = props.pagerProps || {}
		return pageSize || 'pageSize'
	}))
	
	const { searchFields, columns, allowEdit, allowView, allowDelete } = props
	
	// pageIndex 从1开始
	searchFormValue.value[pageIndexName.value] = props.pageIndex - 1
	searchFormValue.value[pageSizeName.value] = props.pageSize
	
	const currentPage = ref(props.pageIndex)
	
	const importName = computed(() => {
		return getObjectProp(props.importProps, 'name', 'file')
	})
	const importUrl = computed(() => {
		return getObjectProp(props.importProps, 'action', '')
	})
	const importTemplateUrl = computed(() => {
		return getObjectProp(props.importProps, 'template', '')
	})
	const importTemplateRemotely = computed(() => {
		return getObjectProp(props.importProps, 'remote', false)
	})
	const importTemplateFileName = computed(() => {
		return getObjectProp(props.importProps, 'fileName', false)
	})
	
	watch(currentPage, (v) => {
		searchFormValue.value[pageIndexName.value] = v - 1
	})
	const totalPages = ref(computed(() => {
		return Math.ceil(props.total / searchFormValue.value[pageSizeName.value])
	}))
	
	const indexMethod = (n) => {
		const { pageSize } = props
		return n + 1 + pageSize * (currentPage.value - 1)
	}
	
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
		emits('beforeOpenEditor')
		if(!props.editorFields || props.editorFields.length === 0) {
			emits('rowCreate');
			return
		}
		editorTitle.value = `新增${props.title}`
		editorValue.value = Object.assign({}, data || props.editorDefaultValue);
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
		emits('beforeOpenEditor', row)
		
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
	const handleEditorSubmit = (val) => {
		if(props.drawerForm) {
			const formValue = editorRef.value.getValue()
			
			// 是否有rules
			if(!props.editorRules || !Object.keys(props.editorRules)) {
				return emits(editMode.value ? 'update' : 'create', formValue, { visible: editorVisible})
			}
				
			editorRef.value.form.validate(valid => {
				if(!valid) {
					return
				}
				 
				emits(editMode.value ? 'update' : 'create', formValue, { visible: editorVisible});
			})
		}
		else {
			emits(editMode.value ? 'update' : 'create', val, { visible: editorVisible});
		}
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
	
	const handleDownloadFile = (fileName, filePath) => {
		useDownload(filePath).then(res => {
			saveFile(fileName, res);
		})
	}
	
	const setRowCommand = (row, command) => {
		return { row, command };
	}
	
	const handleRowActionCommand = ({ row, command }) => {
		emits('rowCommand', row, command);
	}
	
	const handleSortChange = ({ column, prop, order }) => {
		emits('sortChange', column, prop, order);
	}
	
	onMounted(() => {
	 	emits('query', searchFormValue.value)
	})
	
	defineExpose({
		doLayout: () => { tableRef.value.doLayout(); },
		selectedRows: () => { return selectedRows.value },
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
		
		:deep(.el-link) {
			font-size: 13px;
		}
	}
	
</style>