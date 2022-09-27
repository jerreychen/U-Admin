<template>
	<VuSidebarPage :sidebarWidth="250">
		<template #sidebar> 
			<DeptTree ></DeptTree>
		</template>
		<template #content>
			<UserList></UserList>
		</template>
	</VuSidebarPage>
</template>

<script setup>
	import DeptTree from '@/pages/components/user/DeptTree.vue';
	import UserList from '@/pages/components/user/UserList.vue';
	
</script>

<style lang="scss" scoped>
	.dept-tree {
		background-color: #ffffff;
		height: calc(100% - 2rem);
	}
</style>