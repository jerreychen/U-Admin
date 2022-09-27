<template>
	<div class="u-card-icon pointer w-100" :class="{
		'with-hover': hoverable
	}" @click="$emit('click')">
		<VuIcon :src="src" :name="name" :color="color" :size="size" :type="type"></VuIcon>
		<div class="u-card-icon_label margin-top-2" :style="{ 'color': color }">
			<label v-if="label">{{label}}</label>
			<slot v-else>未设置</slot>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		src: { type: String },
		label: { type: String },
		color: { type: String },
		size: { type: Number, default: 36 },
		name: { type: String, default: 'ElementPlus' },
		hoverable: { type: Boolean, default: false },
		type: { type: String, default: 'icon',
			validator(v) { 
				return ['icon', 'image', 'font'].includes(v)
			}
		}
	})
	
	const emits = defineEmits(['click']);
</script>

<style lang="scss" scoped>
	.u-card-icon {
		
		&.with-hover:hover {
			background-color: rgba(200, 200, 200, 0.1);
		}
	}
</style>