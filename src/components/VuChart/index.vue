<template>
	<div class="u-chart" ref="chartRef"></div>
</template>

<script setup>
	import * as echarts from 'echarts';
	import types from '@/utils/types.js';
	
	const props = defineProps({
		type: { type: String, default: 'line' }, 
		title: { type: [String, Object] },
		
		colors: { type: Array },
		dataSource: { type: Array },
		grid: { type: Object },
		legend: { type: Object },
		tooltip: { type: Object },
		xAxis: { type: [Object, Array] },
		yAxis: { type: [Object, Array] },
		series: { type: Array },
	})
	
	const chartRef = ref()
	const chart = ref()
	const chartOpts = ref({})
	
	const doLayout = () => {
		const { dataSource, colors, title, grid, tooltip, xAxis, yAxis, legend, series } = props;
		
		// 设置 title
		if(title) {
			if(types.isObject(title)) {
				chartOpts.value.title = title;
			}
			else {
				chartOpts.value.title = { text: title }
			}
		}
		
		if(colors) {
			chartOpts.value.colors = colors;
		}
		
		// 设置datasource
		if(dataSource) {
			chartOpts.value.dataset = {
				source: dataSource
			}
		}
		
		chartOpts.value.grid = Object.assign({ 
			left: '3%',
			right: '3%',
			bottom: '3%',
			top: '10%',
			containLabel: true
		}, grid || {}) 
		
		chartOpts.value.tooltip = Object.assign({
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		}, tooltip || {});
	
		if(legend) {
			chartOpts.value.legend = legend;
		}
		
		if(xAxis) {
			chartOpts.value.xAxis = xAxis;
		}
		
		if(yAxis) {
			if(types.isObject(yAxis)) {
				chartOpts.value.yAxis = Object.assign({
					splitLine: {
						lineStyle: {
							type: 'dashed'
						}
					}
				}, yAxis);
			}
			else {
				chartOpts.value.yAxis = yAxis
			}
		}
		
		if(series) {
			chartOpts.value.series = series 
		}
		
		chart.value.setOption(chartOpts.value)
	}
	
	onMounted(() => {
		chart.value = markRaw( echarts.init(chartRef.value, {}) )
		doLayout()
	})
	
	onUpdated(()=>{
		doLayout()
	})
	
</script>

<style scoped lang="scss">
	.u-chart {
		height: 100%;
		width: 100%;
	}
</style>