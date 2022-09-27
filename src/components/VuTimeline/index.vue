<template>
	  <el-timeline>
	    <el-timeline-item
	      v-for="(activity, index) in data"
	      :key="index"
		  :placement="placement"
		  :center="center"
	      :type="type"
	      :size="size"
	      :hollow="hollow"
	      :icon="iconKey ? activity[iconKey] : ''"
	      :color="colorKey ? activity[colorKey] : ''"
	      :timestamp="labelKey ? activity[labelKey] : ''">
		  <span v-if="contentKey" v-html="activity[contentKey]"></span>
	      <slot name="item" :item="activity" v-else></slot>
	    </el-timeline-item>
	  </el-timeline>
</template>

<script setup>
	const props = defineProps({
		data: { type: Array, default: () => ([]) },
		placement: { type: String, default: 'top' },
		type: { type: String },
		center: { type: Boolean, default: false },
		size: { type: String, default: 'normal' },
		hollow: { type: Boolean, default: false },
		labelKey: { type: String, default: 'label' },
		contentKey: { type: String },
		colorKey: { type: String },
		iconKey: { type: String }
	})
</script>

<style lang="scss" scoped>
</style>