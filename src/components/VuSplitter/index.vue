<template>
	<div class="u-splitter d-flex" :class="{
		'row': !vertical,
		'column': vertical
	}">
		<div class="u-splitter_start-wrapper">
			<template v-if="resizable">
				<div class="u-splitter_resize" 
					:class="{
						'vertical': vertical,
						'horizontal': !vertical
					}"
					:style="{
						'min-width': !vertical && `${startWidth}px`,
						'max-width': !vertical && `${maxStartWidth}px`,
						'min-height': vertical && `${startWidth}px`,
						'max-height': vertical && `${maxStartWidth}px`
					}">
				</div>
				<div class="u-splitter_thumb" :class="{
					'vertical': vertical,
					'horizontal': !vertical
				}"></div>
			</template>
			<div class="u-splitter_start u-scrollbar" :class="{
				'vertical': vertical,
				'horizontal': !vertical,
				'absolute': resizable,
				'relative': !resizable
			}" :style="{
				'width': !vertical && (resizable ? 'calc(100% - 5px)' : `${startWidth}px`),
				'height': vertical && (resizable ? 'calc(100% - 5px)' : `${startWidth}px`)
			}">
				<slot name="start" v-if="!revert" />
				<slot name="end" v-else />
			</div>
		</div>
		<div id="u-splitter_end" class="u-splitter_end u-scrollbar">
			<slot name="end" v-if="!revert"/>
			<slot name="start" v-else />
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		vertical: { type: Boolean, default: false },
		revert: { type: Boolean, default: false },
		resizable: { type: Boolean, default: true },
		startWidth: { type: Number, default: 250 },
		maxStartWidth: { type: Number, default: 500 }
	})
</script>

<style lang="scss" scoped>
	.u-splitter {
		height: calc(100vh - 80px);
		margin: -20px;
		position: relative;
		
		.u-splitter_start-wrapper {
			position: relative;
			
			.u-splitter_resize {
				position: relative;
				//opacity: 0;
				overflow: scroll;
				
				&.horizontal {
					height: calc(100vh - 80px);
					resize: horizontal;
					
					&::-webkit-scrollbar {
						width: 5px;
						height: inherit;
					}
					
				}
				
				&.vertical {
					resize: vertical;
					width: 100%;
					
					&::-webkit-scrollbar {
						width: calc(100vw);
						height: 5px;
					}
					
				}
				
				&::after {
					content: '';
				}
			}
			
			.u-splitter_thumb {
				background-color: #f6f6f6;
				background-repeat: no-repeat;
				background-position: center;
				box-shadow: 0 0 3px rgba(0,0,0,0.1);
				cursor: col-resize;
				content: '';
				position: absolute;
				pointer-events: none;
				
				&.horizontal {
					background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);
					height: calc(100vh - 80px);
					right: 0;
					top: 0;
					width: 5px;
				}
				&.vertical {
					background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAYAAABSIVz6AAAAAXNSR0IArs4c6QAAAClJREFUKFNjPHPmzH8GBgYGExMTRhBNLz4jvSxC9xjYlwMBBs7HAxXUAGYDfZJxCOPmAAAAAElFTkSuQmCC);
					bottom: 0;
					left: 0;
					height: 5px;
					width: 100%;
				}
			}
			
			.u-splitter_start {
				left: 0;
				overflow: auto;
				top: 0;
				 
				&.horizontal {
					height: 100%;
				}
				&.vertical {
					width: 100%;
				} 
			} 
		}
		
		.u-splitter_end {
			flex-grow: 1;
			height: 100%;
			overflow: auto;
		}
	}
</style>