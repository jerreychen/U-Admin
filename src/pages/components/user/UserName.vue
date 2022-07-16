<template>
	<div class="d-flex row middle">
		<span class="margin-right-2">{{data[config.name]}}</span>
		<el-tooltip placement="top-start" effect="light">
			<VuIcon class="user_name_mobile" name="mobile" 
				:isFaIcon="true" 
				:size="17"
				v-if="data[config.mobile]">
				{{data[config.mobile]}}
			</VuIcon>
			<template #content>
				<div class="d-flex row middle">
					<VuIcon class="margin-right-2" name="mobile"
						:isFaIcon="true" 
						:size="17">
						{{data[config.mobile]}}
					</VuIcon>
					<span>{{data[config.mobile]}}</span>
				</div>
			</template>
		</el-tooltip>
	</div>
</template>

<script setup>
	const props = defineProps({
		data: { type: Object },
		config: { type: Object, default: () => ({}) }
	})
</script>

<style lang="scss" scoped>
	.user_name_mobile {
		cursor: pointer;
	}
</style>