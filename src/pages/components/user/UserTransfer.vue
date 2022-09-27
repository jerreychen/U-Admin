<template>
	<div class="el-transfer d-flex row middle space-between">
		<div class="w-67 el-transfer-panel">
			<div class="el-transfer-panel__header">
				<div class="w-50">
					<el-input placeholder="关键字" class="margin-right-4" prefix-icon="Search" v-model="treeFilterKeyword"></el-input>
				</div>
				<div class="margin-left-4 w-50">
					<el-checkbox label="待选人员" :disabled="pendingUserList.length === 0" @change="handleCheckPendingUser">
					</el-checkbox>
				</div>
			</div>
			<div class="el-transfer-panel__body d-flex row">
				<el-scrollbar class="dept-tree w-50">
					<el-tree ref="treeRef" 
						:data="deptTreeList"
						node-key="id" :default-checked-keys="[0]"
						:props="{
							label: 'title'
						}"
						:highlight-current="true"
						:filter-node-method="handleTreeFilter"
						@node-click="handleTreeNodeClick">
					</el-tree>
				</el-scrollbar>
				<el-scrollbar class="w-50">
					<div class="el-transfer-panel__empty" v-if="pendingUserList.length === 0">无数据</div>
					<template v-else>
						<el-checkbox-group class="selected-item-list" v-model="pendingUserSelected">
							<div class="selected-item padding-x-4 d-flex row middle space-between" v-for="(item, index) in pendingUserList" :key="index">
								<el-checkbox :label="item['id']">
									{{item.nickname}}（{{item.mobile}}）
								</el-checkbox>
							</div>
						</el-checkbox-group>
					</template>
				</el-scrollbar>
			</div>
		</div>
		<div class="d-flex column center space-around padding-6">
			<el-button icon="ArrowRight" type="primary" :disabled="pendingUserSelected.length === 0" class="margin-0 margin-bottom-2" @click="handleSelect"></el-button>
			<el-button icon="ArrowLeft" type="primary" :disabled="dataUserSelected.length === 0" class="margin-0 margin-top-2" @click="handleUnselect"></el-button>
		</div>
		<div class="w-33 el-transfer-panel">
			<div class="el-transfer-panel__header d-flex row middle">
				<el-checkbox label="已选人员" :disabled="dataUserList.length === 0" @change="handleCheckSelected">
				</el-checkbox>
			</div>
			<div class="el-transfer-panel__body">
				<div class="el-transfer-panel__empty" v-if="dataUserList.length === 0">无数据</div>
				<el-scrollbar v-else>
					<el-checkbox-group class="selected-item-list" v-model="dataUserSelected">
						<div class="selected-item padding-x-4 d-flex row middle space-between" v-for="(item,index) in dataUserList" :key="index">
							<el-checkbox :label="item['id']">
								{{item.nickname}}（{{item.mobile}}）
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
	import useService from '@/services/index.js';
	import { getDeptTree } from '@/services/user.js';
	
	const props = defineProps({
		height: { type: Number, default: 300 },
		deptId: { type: Number, default: 0 },
		modelValue: { type: Array, default: () => ([]) }
	})
	const emits = defineEmits(['update:modelValue']);
	 
	const { deptId } = props;
	const deptTreeList = ref([])
	getDeptTree().then(res => {
		if(res.code != 200) {
			return;
		}
		deptTreeList.value = res.data
	})

	const pendingUserList = ref([])
	const pendingUserSelected = ref([])
	
	const dataUserSelected = ref([])
	const dataUserList = ref(props.modelValue)
	
	const treeRef = ref(null)
	
	const treeFilterKeyword = ref('');
	watch(treeFilterKeyword, (val) => {
	  treeRef.value?.filter(val)
	})
	const handleTreeFilter = (v, item) => {
		if (!v) {
			return true
		}
		
		return item['title']?.indexOf(v) >= 0
	}
	
	const loadUserList = (q) => {
		useService('user').list(q).then(res => {
			if(res.code != 200) {
				return;
			}
			pendingUserList.value = res.data.list || []
		})
	}
	
	const handleTreeNodeClick = (data) => {
		loadUserList({ dept_id: data.id })
	}
	
	const updateModelValue = () => {
		emits('update:modelValue', dataUserList.value)
	}
	
	const handleSelect = () => {
		 pendingUserSelected.value.map(id => {
			let findIdx = dataUserList.value.findIndex(v => {
				return v['id'] === id;
			})
			
			if(findIdx >= 0) {
				return;
			}
			
			const item = pendingUserList.value.find(item => {
				return item.id === id;
			})
			
			if(!item) {
				return;
			}
			
			dataUserList.value.push(item);
		})
		updateModelValue();
	}
	
	const handleUnselect = () => {
		dataUserSelected.value.map(id => {
			let findIdx = dataUserList.value.findIndex(v => {
				return v['id'] === id;
			})
			
			if(findIdx >= 0) {
				dataUserList.value.splice(findIdx, 1);
			}
		})
		
		updateModelValue();
	}
	
	const handleCheckPendingUser = (e) => {
		const { data } = props;
		pendingUserSelected.value = e ? pendingUserList.value.map(item => {
			return item['id'];
		}) : [];
	}
	
	const handleCheckSelected = (e) => {
		dataUserSelected.value = e ? dataUserList.value.map(item => {
			return item['id'];
		}) : [];
	}
	
	const handleRemoveSelectedItem = (index, item) => {
		dataUserList.value.splice(index, 1);
		updateModelValue();
	}
	
	onMounted(() => {
		loadUserList();
	})
</script>

<style lang="scss" scoped>
	.el-transfer-panel__body {
		:deep(.el-tree-node__content) {
			padding-bottom: .25rem;
			padding-top: .25rem;
		}
		
		.dept-tree {
			border-right: 1px solid #ebeef5;
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