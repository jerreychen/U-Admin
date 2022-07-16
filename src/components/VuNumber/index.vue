<template>
	<div class="u-number">
		<span class="number-value" :style="{
			'font-size': size,
			'color': color
		}">{{formatVal}}</span>
		<span class="number-unit">{{unit}}</span>
	</div>
</template>

<script setup>
	const props = defineProps({
		value: { type: Number, default: 0 },
		unit: { type: String, default: '' },
		size: { type: String, default: '36px' },
		color: { type: String, defualt: '#333' },
		thousand: { type: Boolean, default: false }
	})
	
	const len = (props.value + '').length
	const formatVal = ref('0'.padStart(len, '0'))
	
	let i = props.value > 100 ? (props.value - 100) : 0;
	const intl = setInterval(() => {
		if(++i >= props.value) {
			clearInterval(intl)
		}
		
		formatVal.value = props.thousand ? i.toThousands().padStart(len, '0') : (i+'').padStart(len, '0')
	}, 1) 
</script>

<style lang="scss" scoped>
	@import '/src/assets/common/font.css';
	
	.u-number {
		padding: 1rem .5rem;
		position: relative;
		text-align: center;
		
		.number-value {
			font-family: 'digital_number';
		}
		.number-unit {
			bottom: 1rem;
			position: absolute;
			right: 0.5rem;
		}
	}
</style>