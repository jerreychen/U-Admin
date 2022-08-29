<template>
	<div ref="tabNaviRef" class="u-navi-tabs d-flex row middle">
		<el-tag :ref="setTagRef" v-for="(tag, index) in tabItems" :key="index"
			class="margin-right-2" 
			:class="{
				'is-active': tag.isActive
			}"
			size="large"
			type="info"
			@click="handleTagClick(index)"
			@close="handleCloseClick(index)"
			:closable="tag.closable ?? true">
			{{ tag.title }}
		</el-tag>
	</div>
</template>

<script setup>
	const tabNaviRef = ref();
	const tagRefs = ref([])
	
	const props = defineProps({
		data: { type: Array, default: () => ([]) }
	})
	
	const emits = defineEmits(['tabAdded', 'tabActivated'])
	
	const store = useStore()
	const route = useRoute()
	const router = useRouter()
	
	const tabItems = reactive(props.data)
	
	const setTagRef = (tag) => {
		tagRefs.value.push(tag)
	}
	
	const handleTagClick = (index) => {
		router.push(tabItems[index].url)
	}
	
	const handleCloseClick = (index) => {
		tabItems.removeAt(index)
		router.push(tabItems[index - 1].url)
	}
	
	watch(route, (r)=> {
		const { path, meta, name, fullPath } = r
		const tabItem = tabItems.findByKeyValue('url', fullPath);
		if(tabItem) {
			let currentIndex = 0
			tabItems.map((item, index) => {
				item.isActive = tabItem.url === item.url;
				if(tabItem.url === item.url) {
					currentIndex = index
				}
			})
			
			nextTick(() => {
				emits('tabActivated', tabNaviRef.value.clientWidth, tagRefs.value[currentIndex].$el.offsetLeft)
			})
		}
		else {
			tabItems.map(item => {
				item.isActive = false;
			})
			tabItems.push({ name, title: meta.title, url: fullPath, closable: true, isActive: true})
			
			nextTick(() => {
				emits('tabAdded', tabNaviRef.value.clientWidth)
			})
		}
	}, {
	    immediate: true
	})
	
	onBeforeUpdate(() => {
		tagRefs.value = []
    });
</script>

<style lang="scss" scoped>
	.u-navi-tabs {
		margin-top: 9px;
			
		.el-tag {
			background-color: #FFF;
			border-color: $lightgray;
			color: $dark;
			cursor: pointer;
			
			&:hover {
				background-color: #FCFCFC;
			}
			
			&.is-active {
				background-color: #F6F6F6;
			}
		}
	}
</style>