<template>
	<el-popover trigger="click" 
		placement="bottom-start"
		width="640px"
		popper-class="icon-list_popper">
		<template #reference>
			<el-input
				class="u-icon-list"
				:placeholder="placeholder"
				:clearable="clearable"
				:disabled="disabled"
				:size="size"
				@input="updateValue"
				:model-value="modelValue">
				<template #prefix v-if="modelValue">
					<VuIcon :name="modelValue"></VuIcon>
				</template>
			</el-input>
		</template>
		<el-scrollbar height="200px">
			<div class="icon-list_panel d-flex wrap">
				<el-icon class="icon-item padding-2 pointer" :size="21" 
					@click="handleIconClick(item)"
					:key="index" v-for="(item, index) in iconNameList">
					<component :is="item"></component>
				</el-icon>
			</div>
		</el-scrollbar>
	</el-popover>
</template>

<script setup>
	const props = defineProps({
		modelValue: { type: String },
		placeholder: { type: String },
		disabled: { type: Boolean, default: false },
		clearable: { type: Boolean, default: true },
		size: { type: String, default: 'default' }
	})
	
	const emits = defineEmits(['update:modelValue'])
	
	const handleIconClick = (name) => {
		emits('update:modelValue', name);
	}
	
	const updateValue = (name) => {
		emits('update:modelValue', name);
	}
</script>

<style lang="scss" scoped>
	.u-icon-list {
		width: 100%;
	}
	.icon-list_panel {
		width: 100%;
		
		.icon-item {
			&:hover {
				background-color: rgba(100, 100, 100, 0.1);
			}
		}
	}
</style>