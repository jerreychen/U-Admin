<template>
     <el-row :gutter="20">
		 <el-col :span="18">
			 <VuContent title="测试标题" icon="Clock">
				 <VuList :data="[]" />
			 </VuContent>
		 </el-col>
		 <el-col :span="6">
		 </el-col>
	 </el-row>
</template>

<script setup>
    const checkedCities = ref(['Shanghai', 'Beijing'])
    const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']
    const handleCheckedCitiesChange = () => {
        
    }
</script>

<style>
</style>