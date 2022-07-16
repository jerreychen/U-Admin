<template>
<div class="u-form-wrapper" v-loading="loading">
    <el-form ref="formRef"
		:style="`width: ${width};`"
        class="u-form align-left"
        :disabled="disabled"
        :rules="formRules"
        :label-width="showLabel ? labelWidth : '0px'"
        :label-position="labelPosition"
        :size="size"
        :inline="inline"
        :status-icon="showStatusIcon"
        :show-message="showMessage"
        :model="formValue">
		<template v-for="(field, index) in formFields" :key="index">
		  <div class="u-form-splitter" v-if="field.type === 'line'">
			<span class="u-form-splitter_label" :style="field.style">{{field.label}}</span>
		  </div>
		  <template v-else>
			<el-form-item 
				class="u-form_item" 
				:prop="field.name"
				:style="field.style"
				:rules="field.rules"
				:required="field.required"
				:class="field.class || ''"
				:label="showLabel ? `${getDefaultPlaceHolder(field, formValue)}:` : ''"
				:label-width="showLabel ? (field.labelWidth || labelWidth) : '0px'"
				v-if="isFunction(field.hidden) ? !field.hidden(formValue[field.name], formValue) : !field.hidden">
				<template #label v-if="field.tips && !showTips">
					<div class="d-flex row middle relative">
						<div class="absolute" style="left:-1rem;">
							<el-popover :content="field.tips" placement="bottom-start">
								<template #reference>
									<el-icon><QuestionFilled /></el-icon>
								</template>
							</el-popover>
						</div>
						<span>{{showLabel ? getDefaultPlaceHolder(field, formValue) : ''}}</span>
						<span>:</span>
					</div>
				</template>
				
				<template v-if="field.type === 'slot'">
					<slot :name="field.slot" :value="formValue"></slot>
				</template>

				<component
					v-else-if="field.type === 'component' && !!field.component"
					:is="field.component"
					:config="field.config"
					:data="formValue"
					v-model="formValue[field.name]">
				</component>

				<el-checkbox
					v-else-if="field.type === 'checkbox'"
					:true-label="field.trueValue"
					:false-label="field.falseValue"
					:disabled="field.disabled"
					:size="field.size"
					v-model="formValue[field.name]">
					{{field.label}}
				</el-checkbox>

				<el-checkbox-group
					v-else-if="field.type === 'checkbox-group'"
					:size="field.size"
					:disabled="field.disabled"
					:min="field.min"
					:max="field.max"
					v-model="formValue[field.name]">
					<el-checkbox v-for="(item,idx) in field.options"
						:label="isObject(item) ? item[field.valueKey || 'value'] : item"
						:key="`u-form-checkbox-option-${idx}`">
					   {{isObject(item) ? item[field.labelKey || 'label'] : item}}
					</el-checkbox>
				</el-checkbox-group>

				<el-radio-group
					v-else-if="field.type === 'radio'"
					:size="field.size"
					:disabled="field.disabled"
					@change="field.change"
					v-model="formValue[field.name]">
					<template v-for="(item, idx) in field.options">
						<el-radio v-if="field.valueFormatter"
							:label="field.valueFormatter(isObject(item) ? item[field.valueKey || 'value'] : item)"
							:key="`u-form-raido-${idx}`">
							{{isObject(item) ? item[field.labelKey || 'label'] : item}}
						</el-radio>
						<el-radio v-else
							:label="isObject(item) ? item[field.valueKey || 'value'] : item"
							:key="`u-form-raido-${idx}`">
							{{isObject(item) ? item[field.labelKey || 'label'] : item}}
						</el-radio>
					</template>
				</el-radio-group>

				<el-radio-group
					v-else-if="field.type === 'radio-button'"
					:size="field.size"
					:disabled="field.disabled"
					v-model="formValue[field.name]">
					<template v-for="(item, idx) in field.options">
						<el-radio-button v-if="field.valueFormatter"
							:label="field.valueFormatter(isObject(item) ? item[field.valueKey || 'value'] : item)"
							:key="`u-form-raido--button-${idx}`">
							{{isObject(item) ? item[field.labelKey || 'label'] : item}}
						</el-radio-button>
						<el-radio-button v-else
							:label="isObject(item) ? item[field.valueKey || 'value'] : item"
							:key="`u-form-raido--button-${idx}`">
							{{isObject(item) ? item[field.labelKey || 'label'] : item}}
						</el-radio-button>
					</template>
				</el-radio-group>

				<el-slider
					v-else-if="field.type === 'slider'"
					:size="field.size"
					:min="field.min"
					:max="field.max"
					:step="field.step || 1"
					:format-tooltip="field.formatTooltip"
					:marks="field.marks"
					:disabled="field.disabled">
				</el-slider>

				<el-rate
					v-else-if="field.type === 'rate'"
					:size="field.size"
					:max="field.max"
					:allow-half="field.allowHalf"
					:show-text="field.showText || true"
					v-model="formValue[field.name]">
				</el-rate>

				<el-switch
					v-else-if="field.type === 'switch'"
					:size="field.size"
					:disabled="field.disabled"
					:width="field.switchWidth"
					:inline-prompt="field.inlinePrompt"
					:active-text="field.activeText"
					:inactive-text="field.inactiveText"
					:active-value="field.activeValue ?? 1"
					:inactive-value="field.inactiveValue ?? 0"
					:active-color="field.activeColor || '#409EFF'"
					:inactive-color="field.inactiveColor || '#C0CCDA'"
					v-model="formValue[field.name]">
				</el-switch>
				
				<VuTagInput
					v-else-if="field.type === 'tag'"
					:size="field.size"
					:name="field.tagName"
					:labelKey="field.labelKey"
					:valueKey="field.valueKey"
					:type="field.type"
					:rounded="field.rounded"
					:effect="field.effect"
					:addable="field.addable ?? false"
					:create="field.handler"
					v-model="formValue[field.name]"></VuTagInput>

				
				<el-date-picker
					v-else-if="field.type === 'date-picker'"
					:size="field.size"
					:clearable="field.clearable"
					:disabled="field.disabled"
					:unlink-panels="field.unlinkPanels"
					:type="field.dateType || 'date'"
					:format="field.format || 'YYYY-MM-DD'"
					:value-format="field.valueForamt || 'YYYY-MM-DD'"
					:start-placeholder="field.startPlaceholder || `${getDefaultPlaceHolder(field, formValue)}开始`"
					:end-placeholder="field.endPlaceholder || `${getDefaultPlaceHolder(field, formValue)}结束`"
					:range-separator="field.rangeSeparator || '-'"
					:placeholder="field.placeholder || `请选择${getDefaultPlaceHolder(field, formValue)}`"
					v-model="formValue[field.name]">
				</el-date-picker>
				
				<VuDateRange
					v-else-if="field.type === 'date-range'"
					:size="field.size"
					:clearable="field.clearable"
					:disabled="field.disabled"
					:format="field.format || 'YYYY-MM-DD'"
					:value-format="field.valueForamt || 'YYYY-MM-DD'"
					:startPlaceholder="field.startPlaceholder || `${getDefaultPlaceHolder(field, formValue)}开始`"
					:endPlaceholder="field.endPlaceholder || `${getDefaultPlaceHolder(field, formValue)}结束`"
					:rangeSeparator="field.rangeSeparator || '-'"
					v-model="formValue[field.name]">
				</VuDateRange>

				<el-time-picker
					v-else-if="field.type === 'time-picker'"
					:size="field.size"
					:clearable="field.clearable"
					:disabled="field.disabled"
					:format="field.format || 'HH:mm:ss'"
					:is-range="field.isRange"
					:start-placeholder="field.startPlaceholder || `${getDefaultPlaceHolder(field, formValue)}开始`"
					:end-placeholder="field.endPlaceholder || `${getDefaultPlaceHolder(field, formValue)}结束`"
					:range-separator="field.rangeSeparator || '-'"
					:placeholder="field.placeholder || `请选择${getDefaultPlaceHolder(field, formValue)}`"
					v-model="formValue[field.name]">
				</el-time-picker>

				<VuUpload
					v-else-if="field.type === 'upload'"
					:action="field.action"
					:method="field.method"
					:headers="field.headers"
					:limit="field.limit"
					:name="field.inputName"
					:disabled="field.disabled"
					:list-type="field.listType"
					:drag="field.drag"
					:multiple="field.multiple"
					:data="field.data"
					:map="field.map"
					:accept="field.accept"
					:errorMessage="field.errorMessage"
					v-model="formValue[field.name]">
				</VuUpload>

				<VuAvatar 
					v-else-if="field.type === 'avatar'"
					:action="field.action"
					:name="field.inputName"
					:radius="field.radius"
					:changeable="field.changeable"
					:height="field.height"
					:width="field.width"
					:cropRatio="field.cropRatio"
					:outputSize="field.outputSize"
					v-model="formValue[field.name]">
				</VuAvatar>
				
				<el-time-select
					v-else-if="field.type === 'time-select'"
					:size="field.size"
					:clearable="field.clearable"
					:disabled="field.disabled"
					:format="field.format || 'HH:mm'"
					:start="field.start || '09:00'"
					:end="field.end || '21:00'"
					:step="field.step || '00:30'"
					:min-time="field.minTime || '00:00'"
					:max-time="field.maxTime"
					:placeholder="field.placeholder || `请选择${getDefaultPlaceHolder(field, formValue)}`"
					v-model="formValue[field.name]">
				</el-time-select>

				<el-tree-select
					v-else-if="field.type === 'tree-select'"
					style="width: 100%"
					:filterable="field.filterable ?? true"
					v-model="formValue[field.name]"
					:node-key="field.nodeKey || 'id'"
					:multiple="field.multiple || false"
					:data="field.options"
					:props="field.props"
					:lazy="field.lazy"
					:load="field.lazyLoad"
					:render-after-expand="false"
					:check-strictly="field.checkStrictly || false"
					@change="field.change"
					@current-change="field.nodeChange"
					:clearable="field.clearable ?? true"
					:show-checkbox="field.showCheckbox || false"
					:check-on-click-node="!!field.showCheckbox && !!field.checkOnNode"
					:placeholder="field.placeholder || `请选择${getDefaultPlaceHolder(field, formValue)}`">
				</el-tree-select>
				
				<VuTreeCheckbox
					v-else-if="field.type === 'tree-checkbox'"
					:height="field.height"
					:options="field.options"
					:node-key="field.nodeKey"
					:props="field.props"
					:lazy="field.lazy"
					:load="field.lazyLoad"
					:checkOnNode="field.checkOnNode"
					@nodeClick="field.nodeClick"
					v-model="formValue[field.name]">
				</VuTreeCheckbox>

				<VuSelect
					v-else-if="field.type === 'select'"
					:options="field.options"
					:labelKey="field.labelKey"
					:valueKey="field.valueKey"
					:multiple="field.multiple"
					:allowCreate="field.allowCreate"
					:remote="field.remote"
					@query="field.remoteQuery"
					:filterable="field.filterable ?? true"
					:multipleLimit="field.multipleLimit"
					:valueFormatter="field.valueFormatter"
					:placeholder="field.placeholder || `请选择${getDefaultPlaceHolder(field, formValue)}`"
					:size="field.size"
					@create="field.create"
					:clearable="field.clearable ?? true"
					:disabled="field.disabled"
					v-model="formValue[field.name]">
				</VuSelect>

				<VuRemoteSelect
					v-else-if="field.type === 'remote-select'"
					:query="field.query"
					:labelKey="field.labelKey"
					:valueKey="field.valueKey"
					:multiple="field.multiple"
					:multipleLimit="field.multipleLimit"
					:placeholder="field.placeholder || `请选择${getDefaultPlaceHolder(field, formValue)}`"
					:size="field.size"
					:clearable="field.clearable"
					:disabled="field.disabled"
					v-model="formValue[field.name]">
				</VuRemoteSelect>

				<VuNumberRange
					 v-else-if="field.type === 'number-range'"
					 :startPlaceholder="field.startPlaceholder || `最小${getDefaultPlaceHolder(field, formValue)}`"
					 :endPlaceholder="field.endPlaceholder || `最大${getDefaultPlaceHolder(field, formValue)}`"
					 :min="field.min"
					 :max="field.max"
					 :size="field.size"
					 :clearable="field.clearable"
					 :disabled="field.disabled"
					 v-model="formValue[field.name]">
				</VuNumberRange>

				<el-input-number
					v-else-if="field.type === 'number'"
					v-model="formValue[field.name]"
					class="u-form-number-input"
					:step="field.step || 1"
					:controls="field.controls"
					:step-strictly="field.step && field.step > 1"
					:precision="field.precision"
					:min="field.min"
					:max="field.max"
					:size="field.size"
					:disabled="field.disabled"
					:placeholder="field.placeholder || `请输入${getDefaultPlaceHolder(field, formValue)}`">
				</el-input-number>

				<el-autocomplete
					v-else-if="field.type === 'autocomplete'"
					:size="field.size"
					v-model="formValue[field.name]"
					:clearable="field.clearable"
					:disabled="field.disabled"
					:value-key="field.valueKey"
					:fetch-suggestions="field.fetchSuggestions"
					:debounce="field.debounce || 500"
					:placeholder="field.placeholder || `请输入${getDefaultPlaceHolder(field, formValue)}`">
				</el-autocomplete>
				
				<el-cascader 
					v-else-if="field.type === 'cascader'"
					:size="field.size"
					:disabled="field.disabled"
					:clearable="field.clearable"
					:separator="field.separator"
					:props="field.props || {}"
					:options="field.options"
					:filter-method="field.filterMethod"
					v-model="formValue[field.name]"
					:placeholder="field.placeholder || `请输入${getDefaultPlaceHolder(field, formValue)}`">
				</el-cascader>

				<!-- 增强输入框 -->
				<VuTextInput
					v-else-if="field.type === 'x-input'"
					:size="field.size"
					v-model="formValue[field.name]"
					:clearable="field.clearable"
					:disabled="field.disabled"
					:replace="field.replace"
					:maxlength="field.maxLength"
					:placeholder="field.placeholder || `请输入${getDefaultPlaceHolder(field, formValue)}`">
				</VuTextInput>

				<!-- 增强密码框 -->
				<VuPassword
					v-else-if="field.type === 'x-password'"
					:size="field.size"
					v-model="formValue[field.name]"
					:clearable="field.clearable"
					:disabled="field.disabled"
					:minlength="field.minLength"
					:maxlength="field.maxLength"
					:placeholder="field.placeholder || `请输入${getDefaultPlaceHolder(field, formValue)}`">
				</VuPassword>

				<VuWangEditor
					v-else-if="field.type === 'editor'"
					v-model="formValue[field.name]"
					:height="field.height"
					:config="field.config"
					:toolbarConfig = "field.toolbarConfig"
					:placeholder="field.placeholder || `请输入${getDefaultPlaceHolder(field, formValue)}`">
				</VuWangEditor>

				<template v-else-if="field.type === 'label'">
					<label class="u-form-item_label" v-if="field.formatter">{{field.formatter(formValue[field.name], formValue)}}</label>
					<label class="u-form-item_label" v-else>{{formValue[field.name]}}</label>
				</template>
				
				<template v-else-if="field.type === 'html'">
					<label class="u-form-item_label" v-html="field.formatter(formValue[field.name], formValue)" v-if="field.formatter"></label>
					<label class="u-form-item_label" v-html="formValue[field.name]" v-else></label>
				</template>
				
				<template v-else-if="field.type === 'image'">
					<template v-if="Array.isArray(formValue[field.name])">
						<el-image fit="cover"
							:src="`${ field.valueKey ? img[field.valueKey] : img}`" 
							:preview-src-list="`${ field.valueKey ? (formValue[field.name].map(i => { return i[field.valueKey] })) : formValue[field.name] }`"
							:initial-index="idx"
							v-for="(img, idx) in formValue[field.name]"></el-image>
					</template>
					<el-image fit="cover"
						:preview-src-list="`${field.valueKey ? [formValue[field.name][field.valueKey]] : [formValue[field.name]]}`"
						:src="`${ field.valueKey ? formValue[field.name][field.valueKey] : formValue[field.name]}`" 
						v-else></el-image>
				</template>
				
				<el-input v-else-if="field.type === 'color'"
					v-model="formValue[field.name]"
					class="u-form-colorpicker"
					:size="field.size"
					:disabled="field.disabled"
					:readonly="true"
					:clearable="field.clearable"
					:placeholder="field.placeholder || `请输入${getDefaultPlaceHolder(field, formValue)}`">
					<template #suffix>
						<el-color-picker
							style="position: absolute;"
							:size="field.size"
							:show-alpha="field.showAlpha ?? false"
							:disabled="field.disabled" 
							v-model="formValue[field.name]">
						</el-color-picker>
					</template>
				</el-input>
				
				<VuIconList	v-else-if="field.type === 'icon-list'"
					:disabled="field.disabled"
					:placeholder="field.placeholder || `请选择${getDefaultPlaceHolder(field, formValue)}`"
					v-model="formValue[field.name]">
				</VuIconList>
				
				<el-input v-else
					:type="field.type || 'text'"
					v-model="formValue[field.name]"
					:formatter="field.formatter"
					:clearable="field.clearable"
					:showPassword="field.showPassword"
					:disabled="field.disabled"
					:size="field.size"
					:readonly="field.readonly"
					:minlength="field.minLength"
					:maxlength="field.maxLength"
					:rows="field.rows"
					:show-word-limit="field.showWordLimit"
					:placeholder="field.placeholder || `请输入${getDefaultPlaceHolder(field, formValue)}`">
					<template v-if="field.prefix" #prefix>
						<template v-if="field.prefix.type === 'slot'">
							<slot :name="field.prefix.slot" />
						</template>
						<el-icon v-else>
							<component :is="field.prefix.name"></component>
						</el-icon>
					</template>
					<template v-if="field.suffix" #suffix>
						<template v-if="field.suffix.type === 'slot'">
							<slot :name="field.suffix.slot" />
						</template>
						<el-icon v-else>
							<component :is="field.suffix.name"></component>
						</el-icon>
					</template>
				</el-input>

				<div class="u-form-item_tips" v-html="field.tips" v-if="field.tips && showTips"></div>
			</el-form-item>
		  </template>
		</template>
		<slot />
    </el-form>
</div>
</template>

<script setup>
    import VuSelect from './VuSelect.vue'
	import VuRemoteSelect from './VuRemoteSelect.vue'
    import VuPassword from './VuPassword.vue'
	import VuTextInput from './VuTextInput.vue'
	import VuNumberRange from './VuNumberRange.vue'
	import VuDateRange from './VuDateRange.vue'
    import VuUpload from './VuUpload.vue'
	import VuAvatar from './VuAvatar.vue'
	import VuWangEditor from './VuWangEditor.vue'
	import VuTagInput from './VuTagInput.vue'
	import VuIconList from './VuIconList.vue'
	import VuTreeCheckbox from './VuTreeCheckbox.vue'

	const props = defineProps({
		disabled: { type: Boolean, default: false },
		fields: { type: Array, required: true },
		value: { type: Object, default: () => ({}) },
		rules: { type: Object, default: () => ({}) },
		loading: { type: Boolean, default: false },
		showMessage: { type: Boolean, default: true },
		inlineMessage: { type: Boolean, default: false },
		showStatusIcon: { type: Boolean, default: false },
		inline: { type: Boolean, default: false },
		size: { type: String, default: 'default' },
		labelPosition: { type: String, default: 'right' },
		labelWidth: { type: String, default: '80px' },
		showLabel: { type: Boolean, default: true },
		showTips: { type: Boolean, default: false },
		width: { type: String, default: '100%' }
	})
	
	const emits = defineEmits(['update'])
	
	const formRef = ref(null)
	const arrFields = ['checkbox-group']
	const objFields = ['number-range']
	
	// 引用 formValue
	const formFields = reactive(props.fields);
	const formRules = reactive(props.rules)
	// 根据 fields 初始化 formValue
	let formValue = reactive(props.value)
	
	formFields.map(field => {
		if(arrFields.indexOf(field.type) >= 0) {
			formValue[field.name] = []
			return
		}
		
		if(objFields.indexOf(field.type) >= 0) {
			formValue[field.name] = {}
			return
		}
	})
	
	const getProp = (props, key, defaultValue) => {
		if(props) {
			return props[key] || defaultValue
		}
		return defaultValue
	}
	
	const getDefaultPlaceHolder = (field, formValue) => {
		if(Object.prototype.toString.call(field.label) === "[object Function]") {
			return field.label(formValue[field.name], formValue);
		}
		return `${field.label}`
	}
	
	// value 变化响应
	watch(() => props.value, (v) => {
		// 更新 formValue
		Object.assign(formValue, v)
		emits('update', formValue)
	}, { deep: true })
	
	defineExpose({
		form: formRef,
		getValue: () => formValue
	})
</script>

<style scoped lang="scss">
	.u-form-wrapper {
		background-color: $white;
		padding: 15px;

		.u-form {
			display: block;
			
			.u-form-splitter {
				align-items: center;
				color: #666;
				display: flex;
				font-weight: bold;
				line-height: 1rem;
				justify-content: space-around;
				margin-bottom: 1rem;
				position: relative;
				text-align: center;
				
				.u-form-splitter_label {
					background-color: #FFFFFF;
					padding: 0 1.5rem;
					position: absolute;
				}
				
				&::before, &::after {
					background-color: var(--el-input-border-color, var(--el-border-color));
					content: '';
					height: 1px;
					width: 50%;
				}
				
				&::before {
					left: 0;
				}
				&::after {
					right: 0;
				}
			}
			
			.u-form-item_tips {
				color: #999999;
				font-size: .8rem;
				line-height: 1.5rem;
				width: 100%;
			}
			
			.u-form-item_label {
				border-bottom: 1px solid $lightgray;
				height: 100%;
				width: 100%;
			}
			
			.u-form-colorpicker {
				:deep(.el-color-picker) {
					position: absolute;
					right: 0;
					
					.el-color-picker__trigger {
						border-radius: 0 2px 2px 0;
					}
				}
			}
			
			.u-form-number-input {
				width: 100%;
			}
			
			:deep(.is-without-controls) {  
				.el-input__inner {
					text-align: left;
				}
			}
		}
	}
</style>
