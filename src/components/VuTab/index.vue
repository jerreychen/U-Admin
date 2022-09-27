<template>
	<div class="u-tab-wrapper">
		<el-tabs class="u-tab" 
			:type="type" 
			:tab-position="tabPosition"
			@tab-click="$emit('tabClick', this)"
			:stretch="stretch"
			:model-value="activeIndex">
			<template v-if="Array.isArray(title)">
				<el-tab-pane v-for="(item, index) in title" :lazy="true" :label="getTabTitle(item)" :key="index" :name="getTabName(item, index)">
					<template #label>
						<div class="u-tab_title padding-x-4">
							<slot name="title" :item="item">
								{{getTabTitle(item)}}
							</slot>
						</div>
					</template>
					<slot :name="getTabName(item, index)"></slot>
				</el-tab-pane>
			</template>
			<el-tab-pane :name="0" v-else>
				<template #label>
					<div class="u-tab_title padding-x-4">
						<slot name="title" :item="title">
							{{getTabTitle(title)}}
						</slot>
					</div>
				</template>
				<slot />
			</el-tab-pane>
		</el-tabs>
		<div v-if="showFooter" class="padding-x-4 padding-bottom-4">
			<slot name="footer"></slot>
		</div>
		<el-link class="btn-back" :underline="false" @click="goback()" v-if="showBack">
			<VuIcon name="reply" type="font" class="margin-right-1" />返回
		</el-link>
	</div>
</template>

<script setup>
	const props = defineProps({
		title: { type: [String, Object, Array] },
		showBack: { type: Boolean, default: false },
		showFooter: { type: Boolean, default: false },
		type: { type: String, validator: (v) => {
				return !v || ['card', 'border-card'].includes(v);
			}
		},
		tabPosition: { type: String, default: 'top', 
			validator: (v) => {
				return ['top', 'right', 'bottom', 'left'].includes(v);
			}
		}, 
		stretch: { type: Boolean, default: false },
		addable: { type: Boolean, default: false },
		activeIndex: { type: [Number, String], default: 0 },
		titleKey: { type: String, default: 'title' },
		nameKey: { type: String, default: 'name' }
	})
	
	const emits = defineEmits(['tabClick'])
	
	const getTabTitle = (item) => {
		return item[props.titleKey] || item;
	}
	
	const getTabName = (item, index) => {
		return item[props.nameKey] || index;
	}
</script>

<style lang="scss" scoped>
	.u-tab-wrapper {
		position: relative;
		
		.btn-back {
			position: absolute;
			top: 10px;
			right: 1rem;
		}
	}
</style>