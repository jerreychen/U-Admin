<template>
  <div class="page">
    <router-view v-if="isAlive"/>
  </div>
</template>

<script setup>
/* 引用ElementPlus样式库 */
import 'element-plus/dist/index.css';

const isAlive = ref(true)

const reload = () => {
	isAlive.value = false;
	nextTick(() => {
		isAlive.value = true;
	})
}

provide('reload', reload)
</script>

<style lang="scss">
@import './assets/common/basic.scss';
@import './assets/themes/gov/index.scss';
</style>
