<script setup lang="ts">
import { ref, watch, defineOptions, defineProps, defineExpose } from "vue";
// https://plus-pro-components.com/components/check-card-group.html
import "plus-pro-components/es/components/check-card-group/style/css";
import { PlusCheckCardGroup } from "plus-pro-components";

defineOptions({
  name: "SelectOrganize"
});

// 定义 props
const props = defineProps<{
  list: string[];
}>();
const current = ref("0");

const onSubmit = async () => {
  return new Promise(resolve => {
    resolve(true);
    console.log(current.value, "提交了");
  });
};
const initCurrent = (value) => {
  console.log(value, "初始化");
  current.value = value;
};
const getCurrent = () => {
  let find = props.list.find(v => v.value == current.value);  
  return {
    id: find.value,
    selectItem: find
  }
};

defineExpose({
  initCurrent,
  onSubmit,
  getCurrent
});
</script>

<template>
  <el-card shadow="never" class="mb-4">
    <div class="flex justify-center">
      <div class="w-1/2">
        <PlusCheckCardGroup v-model="current" :options="props.list">
          <template #extra> 侧边 </template>
        </PlusCheckCardGroup>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss"> 
::v-deep {
  .plus-check-card-group {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
}
}
</style>
