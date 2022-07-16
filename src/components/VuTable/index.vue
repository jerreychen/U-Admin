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
                <el-button type="primary" icon="Plus" :title="`新增${title}记录`" v-if="allowCreate" @click="$emit('create')">新增{{title}}</el-button>
                <el-popconfirm 
					confirm-button-text="确定"
					cancel-button-text="放弃"
					@confirm="$emit('batchDelete', selectedRows)"
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
				<el-button circle icon="Refresh" title="数据刷新" @click="handleResetSearch" v-if="allowRefresh"></el-button>
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
			:lazy="lazy"
			:load="handleChildrenQuery"
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
				width="50px"
				align="center"
				label="#"
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
                :width="`${rowActionColumnWidth}px`"
                fixed="right"
                v-if="!!actionButtons.length">
                <template #default="scope">
                    <div class="d-flex row middle" :class="{ 'center': rowActionCenter }" style="margin: 0 -0.5rem;">
						<template v-for="(btn, btnIndex) in actionButtons" 
							:key="`u-table-action-button-${btnIndex}`">
							<template v-if="!rowActionButton || rowActionButton(scope.row, btn) !== false">
								<el-popconfirm 
									confirm-button-text="确定"
									cancel-button-text="放弃"
									@confirm="btn.emit ? $emit(btn.emit, scope.row) : (btn.click && btn.click(scope.row))"
									:title="`确定要删除该条记录？`"
									v-if="btn.name === 'delete'">
									<template #reference>
										<el-link
											class="padding-x-1"
											:type="btn.type"
											:icon="btn.icon"
											:disabled="btn.disabled"
											:underline="false">
											{{btn.label}}
										</el-link>
									</template>
								</el-popconfirm>
								<el-link 
									v-else
									class="padding-x-1"
									:type="btn.type"
									:icon="btn.icon"
									@click="btn.emit ? $emit(btn.emit, scope.row) : (btn.click && btn.click(scope.row))"
									:disabled="btn.disabled"
									:underline="false">
									{{btn.label}}
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
</template>

<script setup>
	import { message } from '/@/utils/common.js'
	
	import VuTemplateColumn from './VuTemplateColumn.vue'
	import VuUpload from '../VuForm/VuUpload.vue'

	const props = defineProps( {
		title: { type: String, default: '' },
		
		showLabel: { type: Boolean, default: true },
		loading: { tyep: Boolean, default: false },
		searchFields: { type: Array },
		labelWidth: { type: String, default: '80px' },
		columns: { type: Array, required: true },
		border: { type: Boolean, default: true },
		expandable: { type: Boolean, default: false },
		indexable: { type: Boolean, default: false },
		selectable: { type: Boolean, default: false },
		data: { type: Array, default: () => ([]) },
		pageIndex: { type: Number, default: 1 },
		pageSize: { type: Number, default: 20 },
		total: { type: Number },
		pagerCount: { type: Number, default: 5 },
		indent: { type: Number, default: 16 },
		rowKey: { type: String, default: 'id' },
		lazy: { type: Boolean, default: false },
		
		treeProps: { type: Object },
		pagerProps: { type: Object },
		importProps: { type: Object },
		
		allowImport: { type: Boolean, default: false },
		allowCreate: { type: Boolean, default: true },
		allowEdit: { type: Boolean, default: true },
		allowView: { type: Boolean, default: true },
		allowDelete: { type: Boolean, default: true },
		
		allowSearch: { type: Boolean, default: false },
		allowRefresh: { type: Boolean, default: false },
		allowExport: { type: Boolean, default: false },
		allowFilter: { type: Boolean, default: false },
		allowPrint: { type: Boolean, default: false },
		
		rowActionWidth: { type: Number },
		rowActionCenter: { type: Boolean, default: false },
		rowActionButton: { type: Function },
		rowActionButtons: { type: Array, default: () => ([]) },
		
		cellClick: { type: Function },
		cellDbClick: { type: Function },
		rowClick: { type: Function },
		rowDbClick: { type: Function },
		rowSelectable: { type: Function },
	})
	
	const emits = defineEmits([
		'create', 'query', 'reset', 'import', 'export', 'print',
		'batchDelete', 'rowSelect', 'rowView', 'rowEdit', 'rowDelete',
		'lazyQuery'
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
	
	const importUploader = ref()
	const importDialogVisible = ref(false)
	
	const searchFormValue = ref({ })
	// pageIndex 从1开始
	searchFormValue.value[pageIndexName.value] = props.pageIndex - 1
	searchFormValue.value[pageSizeName.value] = props.pageSize
	
	const currentPage = ref(1)
	
	const getProp = (props, key, defaultValue) => {
		if(props) {
			return props[key] || defaultValue
		}
		return defaultValue
	}
	
	const importName = computed(() => {
		return getProp(props.importProps, 'name', 'file')
	})
	const importUrl = computed(() => {
		return getProp(props.importProps, 'action', '')
	})
	const importTemplateUrl = computed(() => {
		return getProp(props.importProps, 'template', '')
	})
	
	watch(currentPage, (v) => {
		searchFormValue.value[pageIndexName.value] = v - 1
	})
	
	const totalPages = ref(computed(() => {
		return Math.ceil(props.total / searchFormValue.value[pageSizeName.value])
	}))
	
	const searchFormVisible = ref(true)
	const selectedRows = ref([])
	const tableRef = ref()
	const moreShowed = ref(false)
	const flexibleFields = (searchFields || []).filter(field => { return field.hidden != undefined })
	const showMore = ref(computed(() => { return flexibleFields.length > 0 }))
	
	// 字符串数字组引用
	const checkedColumns = ref([])
	columns.map(c => {
		if(!c.hidden) {
			checkedColumns.value.push(c.prop)
		}
	})
	
	const filteredColumns = computed(() => {
		return columns.filter(c=> { return !c.hidden })
	})
	
	const actionButtons = computed(() => {
		let buttons = props.rowActionButtons
		if(allowView) {
			buttons.push({ label: '查看', type: 'default', icon: 'View', emit: 'rowView', name: 'view' })
		}
		if(allowEdit) {
			buttons.push({ label: '编辑', type: 'primary', icon: 'Edit', emit: 'rowEdit', name: 'edit' })
		}
		if(allowDelete) {
			buttons.push({ label: '删除', type: 'danger', icon: 'Delete', emit: 'rowDelete', name: 'delete' })
		}
		return buttons
	})
	
	const rowActionColumnWidth = computed(() => {
		if(!props.rowActionWidth || props.rowActionWidth <= 0) {
			return actionButtons.value.length * 56;
		}
		
		return props.rowActionWidth
	})
	
	// 列隐藏与显示事件
	const handleColumnChange = (vals) => {
		columns.map(c => {
			c.hidden = vals.indexOf(c.prop) < 0
			return c;
		})
		tableRef.value.doLayout()
	}
	// 选择表格行事件
	const handleSelectionChange = (selection) => {
		selectedRows.value = selection
		emits('rowSelect', selection)
	}
	const handlePageSizeChanged = (size) => {
		searchFormValue.value[pageSizeName.value] = size
		emits('query', searchFormValue.value)
	}
	// 分页事件
	const handleCurrentPageChanged = (page) => {
		searchFormValue.value[pageIndexName.value] = page - 1
		emits('query', searchFormValue.value)
	}
	
	const handleSearch = (formValue) => {
		currentPage.value = 1
		formValue[pageIndexName.value] = currentPage.value  - 1
		emits('query', formValue)
	}
	const handleResetSearch = (q) => {
		handleSearch(Object.assign(searchFormValue.value, q || {}))
	}
	
	const handleToggleSearch = () => {
		searchFormVisible.value = !searchFormVisible.value
	}
	
	const handleShowmoreClick = () => {
		moreShowed.value = !moreShowed.value
		
		searchFields.forEach(field => {
			if(field.hidden != undefined) {
				field.hidden = !moreShowed.value
			}
		})
	}
	
	const handleChildrenQuery = (row, tree, callback) => {
		emits('lazyQuery', row, tree, callback)
	}
	
	const handleImport = () => {
		importDialogVisible.value = true
	}
	
	const handleImportSubmit = () => {
		importUploader.value.upload()
	}
	 
	const handleImportCancel = () => {
		importDialogVisible.value = false
	}
	
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
		reload: handleResetSearch
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
		
        :deep(.u-table_header-cell) {
            background-color: #F9F9F9 !important;
        } 
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
</style>