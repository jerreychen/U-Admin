<template>
	<div class="u-list" :class="{
		'd-flex row middle': flex
	}" v-loading="loading">
		<template v-if="data.length === 0">
			<div class="list-empty" v-if="showEmpty">
				<slot name="empty">
					<el-empty :image-size="emptyImageSize" :title="emptyText"></el-empty>
				</slot>
			</div>
		</template>
		<template v-else>
			<div class="u-list_item" v-for="(item, index) in data">
				<slot name="item" :item="item" :index="index"></slot>
			</div>
			<div class="d-flex row middle center margin-top-4" v-if="total > 0">
				<div class="">总共{{ total }}条记录，第{{ currentPage }}页/共{{ totalPages }}页 </div>
				<el-pagination 
					:default-current-page="0"
					class="u-pagination"
					:background="pagerBackground"
					:small="pagerSmall"
					:pager-count="pagerCount"
					:page-sizes="pagerSizes"
					:layout="pagerLayout"
					:prev-text="pagerPrevText"
					:next-text="pagerNextText"
					:total="total"
					v-model:page-size="searchFormValue[pageSizeName]"
					v-model:current-page="currentPage"
					@size-change="handlePageSizeChanged"
					@current-change="handleCurrentPageChanged">
				</el-pagination>
			</div>
		</template>
		<slot name="more"></slot>
	</div>
</template>

<script setup>
	const props = defineProps({
		showEmpty: { type: Boolean, default: true },
		emptyImageSize: { type: Number },
		emptyText: { type: String, default: '暂无数据' },
		flex: { type: Boolean, default: false },
		data: { type: Array, default: () => ([]) }, 
		loading: { type: Boolean, default: false },
		total: { type: Number },
		pageIndex: { type: Number, default: 1 },
		pageSize: { type: Number, default: 10 },
		pagerCount: { type: Number, default: 5 },
		pagerSmall: { type: Boolean, default: false },
		
		pagerProps: { type: Object },
	})
	
	const emits = defineEmits(['changePage', 'query'])
	
	const searchFormValue = ref({ })
	
	const pagerBackground = computed(() => {
		const { background } = props.pagerProps || {}
		return background ?? false;
	})
	const pagerSizes = computed(() => {
		const { sizes } = props.pagerProps || {}
		return sizes || [10, 15, 20, 30, 50];
	})
	const pagerPrevText = computed(() => {
		const { prevText } = props.pagerProps || {}
		return prevText || '';
	})
	const pagerNextText = computed(() => {
		const { nextText } = props.pagerProps || {}
		return nextText || '';
	})
	const pagerLayout = computed(() => {
		const { layout } = props.pagerProps || {}
		return layout || 'prev, pager, next, jumper';
	})
	const pageIndexName = ref(computed(() => {
		const { pageIndex } = props.pagerProps || {}
		return pageIndex || 'pageIndex'
	}))
	const pageSizeName = ref(computed(() => {
		const { pageSize } = props.pagerProps || {}
		return pageSize || 'pageSize'
	}))
	
	const currentPage = ref(1)
	watch(currentPage, (v) => {
		searchFormValue.value[pageIndexName.value] = v - 1
	})
	const totalPages = ref(computed(() => {
		return Math.ceil(props.total / searchFormValue.value[pageSizeName.value])
	}))
	
	// pageIndex 从1开始
	searchFormValue.value[pageIndexName.value] = props.pageIndex - 1
	searchFormValue.value[pageSizeName.value] = props.pageSize
	
	// 分页事件：条数改变
	const handlePageSizeChanged = (size) => {
		searchFormValue.value[pageSizeName.value] = size
		emits('query', searchFormValue.value)
	}
	// 分页事件：页码改变
	const handleCurrentPageChanged = (page) => {
		searchFormValue.value[pageIndexName.value] = page - 1
		emits('query', searchFormValue.value)
	}
	
	onMounted(() => {
		emits('query', searchFormValue.value)
	})
</script>

<style lang="scss" scoped>
	.u-list {
		width: 100%;
		
		.u-list_item {
			position: relative;
		}
		
		.list-empty {
			width: 100%;
			:deep(.el-empty) {
				padding: 1rem 0 !important;
			}
		}
	}
</style>