<template>
    <div class="u-toolbar-item d-flex row center middle">
        <el-tooltip :content="tooltip">        
            <el-icon
                :size="21" 
                color="#666666"
                @click="handleToolbarItemClick">
                <el-badge :value="badgeValue" class="u-toolbar-item_badge" v-if="badgeValue > 0">
                    <component :is="icon" />
                </el-badge>
                <component :is="icon" v-else />
            </el-icon>
        </el-tooltip>
        <slot />
    </div>
</template>

<script>
    export default {
        name: 'VuToolbarItem',
        
        props: {
            icon: { type: String, require: true },
            tooltip: { type: String },
            badgeValue: { type: Number, default: 0 }
        },
        
		emits: ['click'],
		
        setup(props, context) {
            const handleToolbarItemClick = () => {
				context.emit('click')
			}
			return {
				handleToolbarItemClick
			}
        }
    }
</script>

<style lang="scss" scoped>
    .u-toolbar-item {
        cursor: pointer;
        height: 100%;
        line-height: 100%;
        padding: 0 .75rem;
        
        .u-toolbar-item_badge {
            height: 21px;
            line-height: 21px;
        }
        
        &:hover {
            background-color: $lightgray;
        }
    }
</style>