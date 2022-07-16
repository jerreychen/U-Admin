<template>
	<VuContent title="测试标题" :collapsable="true">
		<VuChart type="bar" /> 这是一个测试面板

		<VuForm :fields="fieldList"
			:rules="fieldRules"
			labelWidth="200px"
			width="80%"
			@submit="handleSubmit"
			cancelButtonText="重置">
			<template #testSlot="scope">
				<el-input type="text" v-model="scope.form.test"></el-input>
			</template>
			<template #buttonRight>
				<el-button type="warning" @click="goback()">返回列表</el-button>
			</template>
		</VuForm>
	</VuContent>
</template>

<script setup>
	
    const fieldList = ref([
        { name: 'title', label: '标题', tips: '这是一个测试',tips: '你好这是一个tips', },
        { name: 'category', label: '分类', 
            options: ['分类1', '分类2'],
            type: 'select', 
            style: 'width: 50%;' ,
        },
        { name: 'range', label: '区间', type: 'number-range', style: 'width: 50%' },
        { name: 'sex', label: '性别', tips: '你好这是一个tips',
            options: [{ value: '0', label: '男' }, { value: '1', label: '女' }],
            type: 'radio', style: 'width: 50%'
        },
        { name: 'test', type: 'html', label: 'Slot' },
        { name: 'rate', label: '评分', type: 'component', component: 'ElRate' },
		{ name: 'content', label: '内容', type: 'html' }
    ])
	
	const fieldRules = reactive({
		title: { required: true, message: 'Please input Activity name', trigger: 'blur' }
		
	})

    const handleSubmit = (formValue) => {
        console.log(formValue)
    }
</script>

<style>
</style>