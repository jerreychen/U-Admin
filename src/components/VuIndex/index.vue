<template>
	<div class="u-index-number d-flex row middle" 
		:class="`${placement === 'right' ? '':'reverse'} index-${type}`">
		<slot></slot>
	</div>
</template>

<script setup>
	const props = defineProps({
		type: {
			type: String, default: 'dot', validator: (v) => {
				return ['dot', 'triangle-up', 'triangle-down'].includes(v);
			}
		},
		color: { type: String, default: '#ED3942'},
		size: { type: Number, default: 10 },
		placement: {
			type: String, default: 'right', validator: (v) => {
				return ['left', 'right'].includes(v);
			},
		}
	})
	
	const dotSizePx = computed(() => {
		return `${props.size}px`;
	})
	
	const triangleSizePx = computed(() => {
		return `${props.size / 2}px`;
	})
</script>

<style lang="scss" scoped>
	.u-index-number {
		position: relative;
		overflow-y: hidden;
		
		&::after {
			content: '';
			display: block;
			margin: 0 .25rem;
		}
		
		&.index-dot {
			&::after {
				background-color: v-bind('color');
				border-radius: 50%;
				height: v-bind('dotSizePx');
				width: v-bind('dotSizePx');
			}
		}
		
		&.index-triangle-down {
			&::after {
				border-color: v-bind('color') transparent transparent transparent;
				border-style: solid;
				border-width: v-bind('triangleSizePx');
				margin-top: v-bind('triangleSizePx');
			}
		}
		
		&.index-triangle-up {
			&::after {
				border-color: transparent transparent v-bind('color') transparent;
				border-style: solid;
				border-width: v-bind('triangleSizePx');
				margin-bottom: v-bind('triangleSizePx');
			}
		}
	}
</style>