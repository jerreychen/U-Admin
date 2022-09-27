<template> 
<div class="u-breadcrumb-wrapper d-flex row middle">
	<el-icon class="nav-icon-home margin-right-2"><HomeFilled /></el-icon>
    <el-breadcrumb class="u-breadcrumb">
        <el-breadcrumb-item 
            :to="item.path" 
            v-for="(item, index) in breadcrumbList" 
            :key="`breadcrumb-${index}`">
            {{item.label}}
        </el-breadcrumb-item>
    </el-breadcrumb> 
</div>
</template>

<script setup>
    const router = useRouter() 
    const route = useRoute()
    const breadcrumbList = reactive([])
    
    const getBreadcrumbList = (r) => {
        breadcrumbList.empty()
        const matchedRoute = router.resolve({ path: r.path })
        
        const { matched } = matchedRoute
        matched.forEach((item, index) => {
            if(item.meta.title) {
                breadcrumbList.push({
                    path: ((index < matched.length - 1) && !item.meta.noPage) ? item.path : '',
                    label: item.meta.title
                })
            }
        })
        
        breadcrumbList.unshift({ path: breadcrumbList.length === 0 ? '' : { path: '/' }, label: '首页' })
    }
    
    watch(route, getBreadcrumbList, {
        immediate: true
    })
    
</script>

<style lang="scss" scoped>
	.u-breadcrumb-wrapper {
		.nav-icon-home {
			color: $lightgray;
			margin-top: -3px;
		}
	}
</style>