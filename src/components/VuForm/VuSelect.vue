<template>
    <el-select class="u-form-select"
        v-model="value"
        :clearable="clearable" 
        :size="size"
        :placeholder="placeholder"
        :multiple="multiple"
        :multiple-limit="multipleLimit"
        :disabled="disabled">
        <el-option
            v-for="(item, index) in options"
            :key="`u-form-select-option-${index}`"
            :label="isObject(item) ? item[labelKey] : item"
            :value="isObject(item) ? item[valueKey] : index" />
    </el-select>
</template>

<script>
    export default {
        props: {
            value: { type: [String, Number, Boolean, Object] },
            valueKey: { type: String, default: 'value' }, // 和 el-select 原 value-key 不一样
            labelKey: { type: String, default: 'label' },
            size: { type: String, default: 'default' },
            placeholder: { type: String },
            clearable: { type: Boolean, default: true },
            disabled: { type: Boolean, default: false },
            multiple: { type: Boolean, default: false },
            multipleLimit: { type: Number, default: 0 },
            options: { type: Array, default: () => ([]) }
        },
        
        emits: ['update:value'],
        
        setup(props, context) {
            const updateValue = (val) => {
               context.emit('update:value', val) 
            }
            
            return {
                updateValue
            }
        }
    }
</script>

<style lang="scss" scoped>
    .u-form-select {
        width: 100%;
    }
</style>