<template>
	<div class="u-template-column">
		<component v-if="type === 'component' && !!config.component" 
			:is="config.component"
			v-model="data[prop]" 
			:config="config" 
			:data="data" 
			@done="config.done"
			:prop="prop">
		</component>
		
		<el-switch 
			v-else-if="type === 'switch'" 
			v-model="data[prop]" 
			:width="config.width"
			@click.native.stop
			:before-change="config.beforeChange"
			@change="isFunction(config.change) ? config.change($event, data, prop) : undefined"
			:active-value="config.activeValue"
			:inactive-value="config.inactiveValue"
			:active-text="config.activeText"
			:inactive-text="config.inactiveText"
			:inline-prompt="config.inlinePrompt"
			:disabled="isFunction(config.disabled) ? config.disabled(data, prop) : !!config.disabled">
		</el-switch>
	
		<el-input 
			v-else-if="['text', 'password', 'textarea'].indexOf(type) >= 0"
			v-model="data[prop]"
			:size="config.size || 'default'"
			:type="config.type || 'text'"
			:clearable="config.clearable || false"
			:show-password="config.showPassword || false"
			:minlength="config.minLength"
			:maxlength="config.maxLength"
			:rows="config.rows"
			@click.native.stop
			@blur="isFunction(config.blur) ? config.blur(data, prop) : undefined"
			@change="isFunction(config.change) ? config.change(data, prop) : undefined"
			:readonly="config.readonly || false"
			:disabled="config.disabled || false">
		</el-input>
		
		<el-input-number
			v-else-if="type === 'number'"
			v-model="data[prop]"
			:size="config.size || 'default'"
			:controls="config.controls ?? true"
			:style="config.style"
			:min="config.min"
			:max="config.max"
			:precision="config.precision"
			@click.native.stop
			@blur="isFunction(config.blur) ? config.blur(data, prop) : undefined"
			@change="isFunction(config.change) ? config.change(data, prop) : undefined"
			:disabled="config.disabled || false">
		</el-input-number>
		
		<VuTextInput 
			v-else-if="type === 'x-input'" 
			v-model="data[prop]"
			:placeholder="config.placeholder"
			:replace="config.pattern || /[^\d\.]+?/"
			:maxlength="config.maxlength"
			:size="config.size || 'default'"
			:style="config.style"
			:clearable="config.clearable"
			@change="isFunction(config.change) ? config.change($event, data, prop) : undefined"
			:disabled="config.disabled">
		</VuTextInput>
			
		<VuSelect
			v-else-if="type === 'select'"
			v-model="data[prop]"
			:size="config.size || 'default'"
			:valueKey="config.valueKey || 'value'"
			:labelKey="config.labelKey || 'label'"
			:clearable="config.clearable || false"
			:multiple="config.multiple || false"
			:multipleLimit="config.multipleLimit"
			:options="config.options"
			:disabled="config.disabled || false">
		</VuSelect>
		
		<template v-else-if="type === 'el-icon'">
			<el-icon v-if="data[prop]"><component :is="formatter(data, prop)"></component></el-icon>
		</template>
 
		<el-rate
			v-else-if="type === 'rate'"
			v-model="data[prop]"
			:size="config.size || 'default'"
			:color="config.color" 
			:allow-half="config.allowHalf || false"
			:show-text="config.showText || false"
			:show-score="config.showScore || false"
			:effect="config.effect || 'light'"
			@click.native.stop
			@change="isFunction(config.change) ? config.change(data, prop) : undefined"
			:disabled="config.disabled ?? true">
		</el-rate>
			
		<el-avatar
			v-else-if="type === 'avatar'"
			:src="formatter(data, prop)"
			:shape="config.shape || 'circle'"
			@click.native.stop="isFunction(config.click) ? config.click(data, prop) : undefined"
			:size="config.size || 'default'">
		</el-avatar>
		
		<template v-else-if="type === 'color'">
			<div class="d-flex row middle">
				<span style="border:1px solid #f0f0f0;display:inline-block;height:1rem;margin-right:.5rem;width:2rem;" 
					:style="{
						'background-color': formatter(data, prop)
					}">
				</span>
				<span>{{formatter(data, prop)}}</span>
			</div>
		</template>
		
		<el-image
			v-else-if="type === 'image'"
			:src="formatter(data, prop)"
			:fit="config.fit"
			:lazy="config.lazy || false"
			:preview-src-list="!!config.previewable ? (isFunction(config.preview) ? config.preview(data, prop) : [data[prop]]) : undefined"
			:preview-teleported="true"
			@click.native.stop="isFunction(config.click) ? config.click(data, prop) : undefined"
			:style="config.style">
		</el-image>	
		
		<VuUpload v-else-if="type === 'upload'"
			class="upload_in_table"
			v-model="data[prop]"
			listType="picture-card"
			:showTips="false"
			:action="config.action" 
			:style="config.style"
			:limit="config.limit">
		</VuUpload>
		
		<el-progress 
			:percentage="data[prop]" 
			:text-inside="config.textInside"
			:type="config.type"
			:status="config.status"
			:color="config.color"
			:format="config.format"
			:stroke-width="config.strokeWidth"
			:show-text="config.showText"
			v-else-if="type === 'progress'">
		</el-progress>
			
		<el-link
			v-else-if="type === 'link'"
			:size="config.size || 'default'"
			:underline="config.underline ?? true"
			target="_blank"
			:type="config.type"
			:icon="isFunction(config.icon) ? config.icon(data, prop) : config.icon"
			:href="isFunction(config.href) ? config.href(data, prop) : config.href"
			@click.native.stop="isFunction(config.click) ? config.click(data, prop) : undefined"
			:disabled="config.disabled || false">
			{{formatter(data, prop)}}
		</el-link>
		
		<template v-else-if="type === 'tag'">
			<template v-if="Array.isArray(data[prop])">
				<el-tag 
					:hit="config.hit || false"
					:size="config.size || 'default'"
					:type="isFunction(config.type) ? config.type(data, prop, idx) : config.type" 
					:color="isFunction(config.color) ? config.color(data, prop, idx) : config.color" 
					:round="config.round || false"
					:effect="config.effect || 'light'"
					v-for="(text, idx) in formatter(data, prop)" 
					:key="`${index}-${prop}-${idx}`">
					{{text}}
				</el-tag>
			</template>
			<el-tag 
				:hit="config.hit || false" 
				:size="config.size || 'default'"
				:type="isFunction(config.type) ? config.type(data, prop) : config.type" 
				:color="isFunction(config.color) ? config.color(data, prop) : config.color" 
				:round="config.round || false"
				:effect="config.effect || 'light'"
				v-else>
				{{formatter(data, prop)}}
			</el-tag>
		</template>
		
		<span v-else v-html="formatter(data, prop)"></span>
	</div>
</template>

<script>
	import VuSelect from '../VuForm/VuSelect.vue'
	import VuTextInput from '../VuForm/VuTextInput.vue'
	import VuUpload from '../VuForm/VuUpload.vue'
	
	export default {
		components: [VuSelect, VuTextInput],
		
		props: {
			index: { type: [String, Number], default: () => Math.floor(Math.random() * 100000) },
			prop: { type: String, required: true },
			type: { type: String, required: true },
			config: { type: Object, default: () => ({}) },
			data: { type: Object, required: true },
			formatter: { type: Function, default: (row, prop) => {
					return row[prop]
				}
			}
		},
		
		setup(props, context) {
			const { config, data } = toRefs(props)
		}
	}
</script>

<style scoped lang="scss">

</style>