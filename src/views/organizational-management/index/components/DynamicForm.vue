<template>
  <el-form label-width="180" :model="form" :rules="rules" ref="formRef">
    <div v-for="field in fields" :key="field.id">
      <!-- 文本输入 -->
      <el-form-item
        v-if="isInputType(field.type)"
        :label="field.fieldName"
        :prop="field.fieldName"
      >
        <el-input v-model="field.fieldValue" placeholder="请输入" clearable />
      </el-form-item>

      <!-- 图片上传 -->
      <el-form-item
        v-else-if="field.type === 2"
        :label="field.fieldName"
      >
        <ReUploadImage v-model="field.fieldValue" :multiple="false" :limit="1" />
      </el-form-item>

      <!-- 下拉选择 -->
      <el-form-item
        v-else-if="field.type === 3"
        :label="field.fieldName"
        :prop="field.fieldName"
      >
        <el-select v-model="field.fieldValue" placeholder="请选择">
          <el-option
            v-for="option in getOptions(field)"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <!-- 富文本 -->
      <el-form-item
        v-else-if="field.type === 4"
        :label="field.fieldName"
        :prop="field.fieldName"
      >
        <Editor v-model:value="field.fieldValue" />
      </el-form-item>

      <!-- 数字输入 -->
      <el-form-item
        v-else-if="field.type === 5"
        :label="field.fieldName"
        :prop="field.fieldName"
      >
        <el-input-number v-model="field.fieldValue" />
      </el-form-item>

      <!-- 日期输入 -->
      <el-form-item
        v-else-if="field.type === 6"
        :label="field.fieldName"
        :prop="field.fieldName"
      >
        <el-date-picker v-model="field.fieldValue" type="date" placeholder="请选择日期" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, defineExpose } from 'vue';
import ReUploadImage from '@/components/ReUploadImage/index.vue';
import Editor from '@/components/Editor.vue';

const props = defineProps({
  fields: {
    type: Array as () => Array<{
      id: number;
      name: string;
      type: number;
      remark?: string;
    }>,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  id: {
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

// 初始化 form 数据
const form = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
});

// 判断是否是文本类型
function isInputType(type: number): boolean {
  return type === 1 || type === 5 || type === 6; // 包括文本、数字、日期
}

// 模拟获取选项（可替换为接口调用）
function getOptions(field) {
  // todo: 根据 field 的 remark 或 name 获取真实选项
  return [
    { label: '全部园区', value: 0 },
    { label: '园区A', value: 1 },
    { label: '园区B', value: 2 }
  ];
}

const getFormData = () => {
  let list = props.fields?.map(item => {
    return {
      fieldName: item.name,
      fieldParentId: item.parentId,
      fieldValue: item.value,
      fieldId: item.fieldId,
      id: item.id
    };
  });
  return list;
}

defineExpose({
  getFormData
})
</script>

<style scoped lang="scss">
::v-deep .el-form-item__content {
  width: 100%;
}
</style>