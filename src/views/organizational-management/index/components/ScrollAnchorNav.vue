<template>
  <div class="scroll-anchor-nav-scrollbar">
    <el-row :gutter="20">
      <!-- 内容区域 -->
      <el-col :span="contentSpan">
        <el-scrollbar ref="scrollbarRef" :style="{ height: contentHeight }">
          <div class="scroll-content">
            <!-- Header 插槽 -->
            <slot name="header"></slot>

            <!-- 加载状态 -->
            <div v-if="loading" class="loading flex justify-center items-center" style="height: 100px">
              <el-spin />
            </div>

            <!-- 默认内容插槽 -->
            <slot v-else name="default">
              <div
                v-for="item in anchorItems"
                :key="item.id"
                :id="item.id.substring(1)"
                class="section"
                :style="sectionStyle"
              >
                {{ item.title }}
              </div>
            </slot>

            <!-- Footer 插槽 -->
            <slot name="footer"></slot>
          </div>
        </el-scrollbar>
      </el-col>

      <!-- 电梯导航区域 -->
      <el-col :span="navSpan" style="position: relative; ">
        <div class="anchor-wrapper pl-10" :style="anchorPositionStyle">
          <el-anchor
            :container="scrollContainer"
            direction="vertical"
            type="default"
            :offset="offset"
            @click="handleClick"
          >
            <el-anchor-link
              v-for="item in anchorItems"
              :key="item.id"
              :href="item.id"
              :title="item.title"
            />
          </el-anchor>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// Props 定义
const props = defineProps({
  // 锚点数据
  anchors: {
    type: Array as () => { title: string; id: string }[],
    required: true
  },
  // 内容高度
  contentHeight: {
    type: String,
    default: '300px'
  },
  // section 样式
  sectionStyle: {
    type: Object,
    default: () => ({
      height: '300px',
      marginTop: '30px'
    })
  },
  // span 配置
  contentSpan: { type: Number, default: 20 },
  navSpan: { type: Number, default: 4 },
  offset: { type: Number, default: 30 },
  // 定位方式
  position: {
    type: Object as () => { top?: string; bottom?: string; left?: string; right?: string },
    default: () => ({ right: '100px', top: '220px' })
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  }
});

// 数据绑定
const anchorItems = ref([...props.anchors]);

// 滚动容器引用
const scrollbarRef = ref();
const scrollContainer = ref<HTMLElement | null>(null);

// 点击阻止默认行为
const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};

// 监听 anchors 变化，动态更新
watch(
  () => props.anchors,
  (newAnchors) => {
    anchorItems.value = [...newAnchors];
  }
);

// 获取滚动容器
onMounted(() => {
  if (scrollbarRef.value) {
    const rawScrollbar = scrollbarRef.value as any;
    scrollContainer.value = rawScrollbar.$el.querySelector('.el-scrollbar__wrap');
  }
});

// 计算定位样式
const anchorPositionStyle = ref<Record<string, string>>({});
watch(
  () => props.position,
  (newPos) => {
    anchorPositionStyle.value = { ...newPos };
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.section {
  box-sizing: border-box;
}

.anchor-wrapper {
  position: fixed;
  z-index: 999;
  width: fit-content;
}

.scroll-anchor-nav-scrollbar {
  width: 100%;
}

// 深度定制 el-anchor 样式
::v-deep(.el-anchor) {
 
}

::v-deep {
  .el-anchor__item {
    width: 100%;
  }
  .el-anchor__link {
    font-size: 16px;
    padding: 10px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
}
</style>