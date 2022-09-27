<template>
	<VuSidebarPage class="home-page" backgroundColor="#ffffff" :revert="false" :resizable="true">
		<template #sidebar>
			<div style="">
				abc
			</div>
		</template>
		<template #content>
			<VuList :data="dataList" :loading="tableLoading"
			 :pagerProps="{ pageIndex: 'page', pageSize: 'size' }"
			 :pageSize="2" :total="total">
				<template #item="{item}">
					<VuContent>{{item.title}}</VuContent>
				</template>
			</VuList>
		</template>
	</VuSidebarPage>
</template>

<script setup>
	import useService from '@/services/index.js';
	
    const total = ref(0)
	const dataList = ref([])
	const tableLoading = ref(false)
	
	const handleTableQuery = (q) => {
		tableLoading.value = true
		useService('content').list(q).then(res => {
			tableLoading.value = false
			if(res.code === 200) {
				dataList.value = res.data.list
				//total.value = res.data.total
			}
		})
	}
	handleTableQuery()
</script>

<style lang="scss" scoped>
</style>