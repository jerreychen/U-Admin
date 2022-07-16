<template>
	<div class="u-water-print_wrapper">
		<slot />
		<div class="u-water-print" :style="{
			'background-image': `url(${backgroundUrl})`,
			'z-index': zIndex
		}" v-if="false"></div>
	</div>
</template>

<script setup>
	const props = defineProps({
	    text: { type: String, default: 'Water Print' },
		color: { type: String, default: '#FAFAFA' },
		size: { type: Number, default: 150 },
		zIndex: { type: Number, default: 99 }
	})
	
	const createBase64 = () => {
		var cas = document.createElement('canvas')
		var ctx = cas.getContext('2d')
		cas.width = props.size
		cas.height = props.size
		//ctx.fillStyle = 'transparent'
		//ctx.fillRect( 0, 0, 150, 150 )
		ctx.font="15px Arial";
		ctx.strokeStyle = props.color
		ctx.rotate(-45)
		ctx.strokeText(props.text, -props.size * 0.6, props.size * .6)
		return  cas.toDataURL('image/png', 1)  //1表示质量(无损压缩)
	}
	
	const backgroundUrl = ref()
	
	onMounted(() => {
		backgroundUrl.value = `${createBase64()}`
	})
</script>

<style lang="scss" scoped>
	.u-water-print_wrapper {
		position: relative;
		min-height: 100%;
	}
	.u-water-print {
		background-color: transparent;
		background-repeat: repeat;
		height: 100%;
		left: 0;
		overflow: hidden;
		position: absolute;
		pointer-events: none;
		top: 0;
		width: 100%;
	}
</style>