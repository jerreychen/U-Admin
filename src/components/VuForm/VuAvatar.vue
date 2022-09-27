<template>
  <div class="u-avatar_wrapper" @click="handleChangeAvatar">
	<el-image class="u-avatar" 
		:class="{
			'clickable': changeable
		}"
		:src="modelValue" :style="{
			'border-radius': radius,
			'height': height,
			'width': width
		}"></el-image>
	<template v-if="changeable">
		<VuDialog
			title="更换选择"
			width="65vw"
			:showHelp="true"
			@confirm="handleDialogConfirm"
			@cancel="handleDialogCancel"
			:visible="dialogVisible">
			<el-row :gutter="20">
				<el-col :span="14" class="relative">
					<VueCropper ref="cropper"
						style="height: 350px"
						:img="imageUrl"
						:autoCrop="true"
						:canMove="false"
						:outputSize="outputSize"
						:autoCropWidth="cropWidth"
						:autoCropHeight="cropHeight"
						:fixed="true"
						:fixedBox="true"
						:fixedNumber="[cropWidth, cropHeight]"
						outputType="png"
						@realTime="handleRealTimePreview">
					</VueCropper>
					<div class="crop-controls d-flex column">
						<el-icon @click.stop="handleZoomIn" class="margin-bottom-3" :size="21"><ZoomIn /></el-icon>
						<el-icon @click.stop="handleZoomOut" :size="21"><ZoomOut /></el-icon>
					</div>
				</el-col>
				<el-col :span="10" align="center">
					<div style="height:100%" class="d-flex column center space-between">
						<div class="u-avatar_preview" :style="{
								'border-radius': `${rounded}%`,
								'height': `${cropHeight}px`,
								'width': `${cropWidth}px`
							}">
							<img :src="previewUrl" class="u-avatar_preview-img"
								:style="previewStyle" />	
						</div>
						<div class="margin-y-4">预览（长宽比：{{cropRatio}}）</div>
						<el-slider class="u-avatar_preview-rounded margin-bottom-4" v-model="rounded" 
							:show-tooltip="false" 
							size="small" 
							:marks="{0: '直角', 50: '圆角'}"
							:min="0" :max="50"/>
					</div>
				</el-col>
			</el-row>
			<template #help>
				<el-upload ref="uploader"
					class="d-flex row middle" 
					:multiple="false"
					accept=".jpg,.jpeg,.png,.webp"
					:show-file-list="false"
					:limit="1"
					:on-change="handleOnChange"
					:on-exceed="handleOnExceed"
					v-model:file-list="fileList"
					:auto-upload="false">
					<el-button type="primary" list-type="picture-card">选择图片</el-button>
					<template #tip>
						<div class="el-upload__tip margin-top-0 margin-left-2">允许上传文件类型（.jpg,.jpeg,.png,.webp）</div>
					</template>
				</el-upload>
			</template>
		</VuDialog>
	</template>
  </div>
</template>

<script setup>
	import 'vue-cropper/dist/index.css'
	import {VueCropper} from 'vue-cropper'
	import message from '@/utils/message.js'
	import request from '@/utils/request.js'
	import { genFileId } from 'element-plus'
	import defaultAvatarUrl from '@/assets/common/images/default_avatar.png'
	
	const store = useStore()

	const props = defineProps({
		action: { type: String },
		name: { type: String, default: 'file' },
		modelValue: { type: String, default: defaultAvatarUrl },
		map: { type: Object, default: () => ({ }) },
		data: { type: Object, default: ()=>({ }) },
		radius: { type: String, default: '0px' },
		cropRatio: {
			type: Number, default: 1, 
			validator: (v) => {
				if(v > 5 || v < 0.2) {
					message('错误提示', '宽高比应设置在 0.2 ~ 5 之间').notify('error')
				}
				return true
			}
		},
		width: { type: String, default: '100px' },
		height: { type: String, default: '100px' },
		changeable: { type: Boolean, default: false },
		outputSize: { type: Number, default: 1 }
	})
	
	const emits = defineEmits(['update:modelValue'])
	
	const uploader = ref()
	const fileList = ref([])
	
	const dialogVisible = ref(false)
	const cropper = ref()
	const rounded = ref(0)
	const imageUrl = ref('')
	const previewUrl = ref('')
	const previewStyle = ref({})
	
	const cropHeight = computed(() => {
		if(props.cropRatio < 0.1 || props.cropRatio > 5) {
			return 250;
		}
		if(props.cropRatio > 1.35) {
			return Math.ceil(320 / props.cropRatio)
		}
		return 250
	})
	const cropWidth = computed(() => {
		if(props.cropRatio < 0.1 || props.cropRatio > 5) {
			return 250;
		}
		if(props.cropRatio > 1.35) {
			return 320
		}
		return Math.ceil(250 * props.cropRatio)
	})
	
	const resMap = Object.assign({ 
		code: 'code', 
		data: 'data', 
		message: 'msg'
	}, props.map)
	
	watch(() => props.modelValue, (v) => {
		imageUrl.value = v
	})
	
	const handleChangeAvatar = () => {
		if(!props.changeable) {
			return
		}
		
		dialogVisible.value = true
	}
	
	const handleZoomIn = () => {
		cropper.value.changeScale(1)
	}
	
	const handleZoomOut = () => {
		cropper.value.changeScale(-1)
	}
	
	const handleRealTimePreview = (preview) => {
		const { width, height, transform } = preview.img
		previewUrl.value = preview.url
		previewStyle.value = { width, height, transform }
	}
	
	const handleDialogConfirm = () => {
		cropper.value.getCropBlob(data => {
			const file = new File([data], 'avatar_crop.png', { 
				type: 'image/png', 
				lastModified: Date.now()
			})
			
			let params = new FormData()
			params.append(props.name, file)
			
			request.post(props.action, params, {
				headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
			}).then(res=>{
				if(res[resMap['code']] === 0) {
					let url = res[resMap['data']]
					message('成功提示', '头像更新成功！').notify('success')
					emits('update:modelValue', url.startsWith('http') ? url : `${import.meta.env.VITE_APP_API_HOST}${url}`)
					dialogVisible.value = false
					return 
				}
				
				message('错误提示', res[resMap['message']] || errorMessage).notify('error')
			})
		})
	}
	
	const handleOnChange = ({raw}) => {
		if (raw.type.indexOf("image/") === -1) {
			message('错误提示', "文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。").notify('error')
			return
		}
		const reader = new FileReader();
		reader.readAsDataURL(raw);
		reader.onload = () => {
			imageUrl.value = reader.result;
		}
	}
	// 覆盖
	const handleOnExceed = (files) => {
		uploader.value.clearFiles()
		const file = files[0]
		file.uid = genFileId()
		uploader.value.handleStart(file)
	}
	
	const handleDialogCancel = () => {
		imageUrl.value = props.modelValue
		dialogVisible.value = false
	}
</script>

<style lang="scss" scoped>
	.u-avatar {
		position: relative;
		
		&.clickable {
			cursor: pointer;
			
			&:hover {
				&::after {
					align-items: center;
					color: #fff;
					content: '更换头像';
					background-color: rgba(0, 0, 0, 0.25);
					display: flex;
					height: 100%;
					left: 0;
					justify-content: center;
					position: absolute;
					pointer-events: none;
					top: 0;
					width: 100%;
				}
			}
		}
	}
	
	.crop-controls {
		background-color: $lightgray;
		padding: .5rem .25rem;
		position: absolute;
		right: -1.25rem;
		top: 0;
		
		.el-icon {
			cursor: pointer;
		}
	}
	
	.u-avatar_preview {
		background-color: $gray;
		overflow: hidden;
	}
	
	.u-avatar_preview-rounded {
		:deep(.el-slider__marks-text) {
			width: 2rem;
		}
	}
</style>