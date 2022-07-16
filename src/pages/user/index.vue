<template>
	<VuSplitter :sidebarWidth="250">
		<template #left>
			<div class="dept-tree margin-y-4 margin-left-4">
				<DeptTree ></DeptTree>
			</div>
		</template>
		<template #right>
			<UserList></UserList>
		</template>
	</VuSplitter>
</template>

<script setup>
	import DeptTree from '/@/pages/components/user/DeptTree.vue';
	import UserList from '/@/pages/components/user/UserList.vue';
	
</script>

<style lang="scss" scoped>
	.dept-tree {
		background-color: #ffffff;
		height: calc(100% - 2rem);
	}
</style>