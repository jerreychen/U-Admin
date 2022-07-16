<template>
	<div class="u-chart" ref="chartRef" :style="`height:${height}px;`"></div>
</template>

<script setup>
	import * as echarts from 'echarts'
	
	const props = defineProps({
		type: { type: String, default: 'line' },
		height: { type: Number, default: 250 },
		title: { type: String, default: '' },
		
		dataSource: { type: Array, default: () => ([]) },
		
		grid: { type: Object, default: () => ({ })},
		xAxis: { type: Object, default: () => ({ })},
		yAxis: { type: Object, default: () => ({ })},
		legend: { type: Object, default: () => ({ })},
		radar: { type: Object, default: () => ({ })},
		tooltip: { type: Object, default: () => ({ })},
		polar: { type: Object, default: () => ({ })},
		series: { type: Array },
	})
	
	const chartRef = ref()
	const chart = ref()
	
	const doLayout = () => {
		const chartOpts = {
			dataset: {
				source: props.dataSource
			},
			grid: Object.assign({ 
				bottom: 20,
				left: 20,
				right: 20,
				top: 20,
				containLabel: true
			}, props.grid),
			legend: props.legend,
			tooltip: props.tooltip,
			series: props.series
		}
		
		if(props.title) {
			Object.assign(chartOpts, {
				title: { text: props.title },
			})
		}
		
		if(['ring', 'pie', 'gauge'].indexOf(props.type) < 0) {
			Object.assign(chartOpts, { xAxis: props.xAxis, yAxis: props.yAxis })
		}
		
		chart.value.setOption(chartOpts)
	}
	
	onMounted(() => {
		chart.value = echarts.init(chartRef.value, {})
		doLayout()
	})
	
	onUpdated(()=>{
		doLayout()
	})
	
</script>

<style scoped lang="scss">
	.u-chart {
		width: 100%;
	}
</style>