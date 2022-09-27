<template>
	<VuContent :title="contentTitle" :showBack="true">
		<VuFormBox class="margin-bottom-0" ref="contentFormRef"
			:fields="fieldList"
			:value="formValue"
			:rules="fieldRules"
			labelWidth="120px"
			:showTips="true"
			:inline="true"
			@submit="handleFormSubmit"
			:loading="formLoading"
			:showConfirm="confirmButtonVisible"
			confirmText="提交&保存"
			:buttonAlignRight="true"
			:buttonFullWidth="true"
			:showCancel="false">
		</VuFormBox>
	</VuContent>
</template>

<script setup>
	import message from '@/utils/message.js';
	import useService from '@/services/index.js';
	
	const router = useRouter();
	const contentFormRef = ref();
	const contentCategories = ref([])
	useService('content_category').list().then(res => {
		if(res.code != 200) {
			return;
		}
		if(!res.data || !res.data.list || !Array.isArray(res.data.list)) {
			return;
		}
		contentCategories.value = res.data.list;
	})
	
	const formValue = ref({ original: 1 })
	const formLoading = ref(false)
    const fieldList = ref([
        { name: 'title', label: '标题', style: 'width:100%' },
        { name: 'url_alias', label: '链接别名', style: 'width:100%', 
			tips: '有助于SEO优化的友好地址，由字母、数字、下划线（_）、连接符（-）等组成' ,
		},
		{ name: 'category_ids', label: '分类', 
		    options: contentCategories,
			valueKey: 'id', 
			labelKey: 'title',
		    type: 'select', 
		    style: 'width: 100%;' , valueFormatter: (v) => { return v+''; }
		},
		{ name: 'description', label: '简介', type: 'textarea', style: 'width:100%' },
		{ name: 'author', 
			label: (v, d) => {
				return `${!d.original ? '源' : ''}作者`;
			},
			style: 'margin-right:0;width:40%' ,
		},
		{ name: 'sort', label: '排序号', style: 'margin-right:0;width:30%' },
		{ name: 'original', label: '原创', style: 'margin-right:0;width:30%', type: 'switch' ,
			activeText: '是',
			inactiveText: '否',
			inlinePrompt: true, 
			switchWidth: '45px'
		},
		{ name: 'source_title', label: '源标题', style: 'width: 100%', 
			hidden: (v, d) => {
				return !!d.original
			}
		},
		{ name: 'source_url', label: '源链接', style: 'width: 100%' ,
			hidden: (v, d) => {
				return !!d.original
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

    const handleFormSubmit = (values) => {
		let p = null;
		if(values.id) {
			p = useService('content').update(values)
		}
		else {
			p = useService('content').create(values);
		}
        
		p.then(res => { 
			if(res.code === 200) {
				message('成功提示', '内容保存成功').notify('success')
				router.back();
			}
		})
    }
	
	onMounted(() => {
		const contentId = Number(router.currentRoute.value.params.contentId || 0)
		contentFormRef.value.getForm().resetFields();
		formValue.value = { original: 1 }
		contentTitle.value = contentId > 0 ? `编辑文章内容（编号：${contentId}）` : '新建文章内容';
		if(!contentId) {
			return
		}
		
		formLoading.value = true
		useService('content').get({ id: contentId }).then(res => {
			formLoading.value = false
			if(res.code === 200) {
				formValue.value = res.data
				confirmButtonVisible.value = res.data.status == 0
			}
		})
	})
</script>

<style>
</style>