<template>
	<div class="el-transfer d-flex row middle space-between">
		<div class="w-50 el-transfer-panel">
			<div class="el-transfer-panel__header">
				<el-checkbox :label="titles[0]" :disabled="data.length === 0" @change="handleCheckTree">
				</el-checkbox>
				<el-input placeholder="关键字" class="margin-right-2" prefix-icon="Search" v-model="treeFilterKeyword"></el-input>
			</div>
			<div class="el-transfer-panel__body">
				<el-scrollbar>
					<el-tree ref="treeRef" 
						:data="data" 
						:show-checkbox="true" 
						:check-strictly="checkStrictlyRef"
						:node-key="nodeKey"
						:default-checked-keys="defaultCheckKeys"
						:props="treeProps"
						:filter-node-method="handleTreeFilter"
						@check="handleTreeNodeCheck">
					</el-tree>
				</el-scrollbar>
			</div>
		</div>
		<div class="d-flex column center space-around padding-6">
			<el-button icon="ArrowRight" type="primary" :disabled="!nodeChecked" class="margin-0 margin-bottom-2" @click="handleSelect"></el-button>
			<el-button icon="ArrowLeft" type="primary" :disabled="selectedItemIds.length === 0" class="margin-0 margin-top-2" @click="handleUnselect"></el-button>
		</div>
		<div class="w-50 el-transfer-panel">
			<div class="el-transfer-panel__header d-flex row middle">
				<el-checkbox :label="titles[1]" :disabled="selectedDataList.length === 0" @change="handleCheckSelected">
				</el-checkbox>
			</div>
			<div class="el-transfer-panel__body">
				<div class="el-transfer-panel__empty" v-if="selectedDataList.length === 0">无数据</div>
				<el-scrollbar v-else>
					<el-checkbox-group class="selected-item-list" v-model="selectedItemIds">
						<div class="selected-item padding-x-4 d-flex row middle space-between" v-for="(item,index) in selectedDataList" :key="index">
							<el-checkbox :label="item[nodeKey]">
								{{item[treeProps.label]}}
							</el-checkbox>
							<el-icon :size="14" color="#F33" @click="handleRemoveSelectedItem(index, item)"><Delete /></el-icon>
						</div>
					</el-checkbox-group>
				</el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		titles: { type: Array, default: () => (['待选', '已选']),
			validator(value) {
				return value.length === 2;
			}
		},
		height: { type: Number, default: 300 },
		data: { type: Array, default: () => ([]) },
		treeProps: { type: Object, default: () => ({
			children: 'children',
			label: 'label'
		}) },
		nodeKey: { type: String, default: 'id' },
		checkStrictly: { type: Boolean, default: false },
		modelValue: { type: Array, default: () => ([]) }
	})
	
	const checkStrictlyRef = ref(props.checkStrictly);

	const labelKey = computed(() => {
		const { label } = props.treeProps;
		return label;
	})
	
	const defaultCheckKeys = ref([]);
	const selectedItemIds = ref([])
	const selectedDataList = ref([])
	
	const emits = defineEmits(['update:modelValue']);
	
	const treeRef = ref(null)
	const nodeChecked = ref(false)
	
	const treeFilterKeyword = ref('');
	watch(treeFilterKeyword, (val) => {
	  treeRef.value?.filter(val)
	})
	const handleTreeFilter = (v, item) => {
		if (!v) {
			return true
		}
		
		return item[labelKey.value]?.indexOf(v) >= 0
	}
	
	const handleTreeNodeCheck = (node, {checkedNodes}) => {
		nodeChecked.value = checkedNodes.length > 0;
	}
	
	const updateModelValue = () => {
		emits('update:modelValue', selectedDataList.value.map(item => {
			return item[props.nodeKey];
		}))
	}
	
	const handleSelect = () => {
		const selectedNodes = treeRef.value.getCheckedNodes(!props.checkStrictly, props.checkStrictly);
		selectedNodes.map(item => {
			let node = treeRef.value.getNode(item[props.nodeKey]);
			node && (node.data.disabled = true);
			
			let findIdx = selectedDataList.value.findIndex(v => {
				return v[props.nodeKey] === item[props.nodeKey];
			})
			
			if(findIdx < 0) {
				selectedDataList.value.push(item);
			}
		})
		updateModelValue();
	}
	
	const handleUnselect = () => {
		selectedItemIds.value.map(id => {
			let findIdx = selectedDataList.value.findIndex(v => {
				return v[props.nodeKey] === id;
			})
			
			if(findIdx >= 0) {
				selectedDataList.value.splice(findIdx, 1);
			}
			
			let node = treeRef.value.getNode(id);
			node && (node.data.disabled = false);
		})
		
		updateModelValue();
	}
	
	const handleCheckTree = (e) => {
		const { data } = props;
		checkStrictlyRef.value = false;
		nextTick(() => {
			treeRef.value.setCheckedNodes(e ? data : []);
			checkStrictlyRef.value = true;
			
			const selectedNodes = treeRef.value.getCheckedNodes(!props.checkStrictly, props.checkStrictly); 
			nodeChecked.value = e && selectedNodes.length > 0;
		})
	}
	
	const handleCheckSelected = (e) => {
		selectedItemIds.value = e ? selectedDataList.value.map(item => {
			return item[props.nodeKey];
		}) : []
	}
	
	const handleRemoveSelectedItem = (index, item) => {
		selectedDataList.value.splice(index, 1);
		
		let node = treeRef.value.getNode(item[props.nodeKey]);
		node && (node.data.disabled = false);
		
		updateModelValue();
	}
	
	onMounted(() => {
		treeRef.value.setCheckedKeys(props.modelValue);
		nextTick(() => {
			handleSelect()
		})
	})
	
	onBeforeUnmount(() => {
		const selectedNodes = treeRef.value.getCheckedNodes(!props.checkStrictly, props.checkStrictly);
		selectedNodes.forEach(item => {
			let node = treeRef.value.getNode(item[props.nodeKey]);
			node && (node.data.disabled = false);
		})
	})
</script>

<style lang="scss" scoped>
	.el-transfer-panel__body {
		:deep(.el-tree-node__content) {
			padding-bottom: .25rem;
			padding-top: .25rem;
		}
		
		.selected-item-list {
			.selected-item {
				.el-icon {
					display: none;
					cursor: pointer;
				}
				
				&:hover {
					background-color: #f5f7fa;
					
					.el-icon {
						display: block;
					}
				}
				
				:deep(.el-checkbox__label) {
					font-weight: normal;
				}
			}
		}
	}
</style>