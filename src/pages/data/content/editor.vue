<template>
	<VuContent :title="contentTitle" :showBack="true">
		<VuFormBox class="margin-bottom-0"
			:fields="fieldList"
			:value="formValue"
			:rules="fieldRules"
			labelWidth="120px"
			:showTips="true"
			:inline="true"
			@submit="handleFormSubmit"
			:showConfirm="confirmButtonVisible"
			confirmText="提交&保存"
			:buttonAlignRight="true"
			:buttonFullWidth="true"
			:showCancel="false">
		</VuFormBox>
	</VuContent>
</template>

<script setup>
	import message from '/@/utils/message.js';
	import useService from '/@/services/index.js';
	
	const router = useRouter();
	
	const contentId = Number(router.currentRoute.value.params.contentId || 0)
	
	const formValue = ref({})
    const fieldList = ref([
        { name: 'title', label: '标题', style: 'width:100%' },
        { name: 'url_alias', label: '链接别名', style: 'width:100%', 
			tips: '有助于SEO优化的友好地址，由字母、数字、下划线（_）、连接符（-）等组成' ,
		},
		{ name: 'category_ids', label: '分类', 
		    options: ['分类1', '分类2'],
		    type: 'select', 
		    style: 'width: 100%;' ,
		},
		{ name: 'description', label: '简介', type: 'textarea', style: 'width:100%' },
		{ name: 'author', 
			label: (v, d) => {
				return `${d.original ? '源' : ''}作者`;
			},
			style: 'margin-right:0;width:40%' ,
		},
		{ name: 'sort', label: '排序号', style: 'margin-right:0;width:30%' },
		{ name: 'original', label: '原创', style: 'margin-right:0;width:30%', type: 'switch' ,
			activeText: '是',
			inactiveText: '否'
		},
		{ name: 'source_title', label: '源标题', style: 'width: 100%', 
			hidden: (v, d) => {
				return !d.original
			}
		},
		{ name: 'source_url', label: '源链接', style: 'width: 100%' ,
			hidden: (v, d) => {
				return !d.original
			}
		},
		{ name: 'content', label: '内容', type: 'editor', height: 600, style: 'width: 100%;' , },
		{ name: 'tags', label: '标签', type: 'tag', addable: true }
    ])
	
	const contentTitle = ref('')
	const confirmButtonVisible = ref(true)
	
	const fieldRules = reactive({
		title: { required: true, message: '标题必填！' },
		url_alias: { pattern: /(\w|-|_)+/, message: '格式不正确！'}
	})

    const handleFormSubmit = (formValue) => {
        useService('content').create(formValue).then(res => { 
			if(res.code === 200) {
				message('成功提示', '内容保存成功').notify('success')
				router.back();
			}
		})
    }
	
	onMounted(() => {
		contentTitle.value = contentId > 0 ? `编辑文章内容（编号：${contentId}）` : '新建文章内容';
		if(!contentId) {
			formValue.value = {}
			return
		}
		
		useService('content').get({ id: contentId }).then(res => {
			if(res.code === 200) {
				formValue.value = res.data
				confirmButtonVisible.value = res.data.status == 0
			}
		})
	})
</script>

<style>
</style>