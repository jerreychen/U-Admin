<template>
	<div class="u-content" :style="{ 'height': height ? `${height}px` : 'auto' }" v-loading="loading">
		<div class="u-content_title d-flex row middle space-between"
			:class="{
				'no-icon': !icon,
				'plain_title': plain
			}"
			v-if="title">
			<div class="d-flex row middle">
				<el-icon v-if="icon" style="margin-left: -.5rem;margin-right: .25rem">
					<component :is="icon"></component>
				</el-icon>
				<span class="text">{{title}}</span>
			</div>
			<div class="d-flex row middle">
				<slot name="buttons"></slot>
				<el-link :underline="false" @click="goback()" v-if="showBack">
					<VuIcon name="reply" type="font" class="margin-right-1" />返回
				</el-link>
				<el-icon v-if="collapsable" :title="collapsed ? '展开' : '关闭'" :size="21" @click="handleTogleCollapse">
					<component :is="collapsed ? 'ArrowDownBold': 'ArrowUpBold'"></component>
				</el-icon>
			</div>
		</div>
		<div class="u-content_body" :class="{
			'd-flex row middle': flex,
			'u-content_body-collapsed': collapsable && collapsed,
			'u-content_body-expanded': collapsable && !collapsed,
			'u-content_body-scrollable u-scrollbar margin-x-2': scrollable
		}">
			<slot />
		</div>
		<div class="u-content_footer d-flex row padding-x-4 padding-bottom-4" :class="{
			'right': footerAlign === 'right',
			'center': footerAlign === 'center'
		}" v-if="showFooter">
			<slot name="footer" />
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		title: { type: String },
		icon: { type: String },
		height: { type: Number },
		scrollable: { type: Boolean, default: false },
		flex: { type: Boolean, default: false },
		plain: { type: Boolean, default: false },
		loading: { type: Boolean, default: false },
		showBack: { type: Boolean, default: false },
		showFooter: { type: Boolean, default: false },
		footerAlign: { type: String, default: 'right' },
		collapsable: { type: Boolean, default: false }
	})
	
	const collapsed = ref(false)
	
	const handleTogleCollapse = () => {
		collapsed.value = !collapsed.value
	}
</script>

<style lang="scss" scoped>
	.u-content {
		background-color: $white;
		margin-bottom: 20px;
		
		.u-content_title {
			padding: 10px 1rem;
			border-bottom: 1px solid $lightgray;
			position: relative;
			
			.text {
				font-weight: bold;
			}
			
			&.no-icon {
				&::before {
					background-color: $sky_blue;
					content: '';
					height: 50%;
					width: .25rem;
					left: 0;
					position: absolute;
				}
			}
			
			.el-icon {
				cursor: pointer;
			}
			
			&.plain_title {
				border-bottom-color: transparent;
			}
		}
		
		.u-content_body {
			overflow: hidden;
			transition: max-height 0.50s ease-in-out;
				
			&.u-content_body-collapsed {
				max-height: 0;
			}
			
			&.u-content_body-expanded {
				max-height: 9999px;
			}
			
			&.u-content_body-scrollable {
				overflow: auto;
			}
		}
	}
</style>