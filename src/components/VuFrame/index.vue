<template>
	<div class="u-iframe-wrapper" v-loading="!loaded">
	    <iframe
			ref="iframeRef"
			:src="src"
			class="u-iframe"
			frameborder="no"
			allowtransparency="true"
			:scrolling="scrollable ? 'auto' : 'no'"
	    />
	</div>
</template>

<script setup>
	const props = defineProps({
		src: { type: String },
		scrollable: { type: Boolean, default: true }
	})

	const emits = defineEmits(['loaded', 'message'])
	
	const iframeRef = ref(null)
	const loaded = ref(false)
	
	const iframeLoaded = () => {
		loaded.value = true
		emits('loaded')
	}
	onMounted(()=>{
		if(iframeRef.value.attachEvent) {
			iframeRef.value.attachEvent('onload', iframeLoaded)
		}
		else {
			iframeRef.value.onload = iframeLoaded
		}
	})
	
	const receiveMessage = (e) => {
		emits('message', e)
	}
	
	onBeforeMount(() => {
		// 监听iframe内事件
		if(window.addEventListener){
		  window.addEventListener("message", receiveMessage, false);
		}
		else{
		  window.attachEvent("onmessage", receiveMessage);
		}
	})
	
	onBeforeUnmount(() => {
		// 监听iframe内事件
		if(window.removeEventListener){
		  window.removeEventListener("message", receiveMessage, false);
		}
		else{
		  window.detachEvent("onmessage", receiveMessage);
		}
	})
</script>

<style lang="scss" scoped>
	.u-iframe-wrapper {
		height: calc(100vh - 80px);
		margin: -20px;
		
		.u-iframe {
			border: 0;
			display: block;
			height: 100%;
			width: 100%; 
		}
	}
</style>