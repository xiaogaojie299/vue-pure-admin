<script setup lang="tsx">
import { ref, defineExpose, defineProps } from "vue";
import { FormProps } from "./types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    label-width="82px"
  >
    <el-form-item label="分组名称" prop="name" :rules="[
      { required: true, message: '请输入分组名称', trigger: 'blur' }
    ]">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入分组名称"
      />
    </el-form-item>
  </el-form>
</template>
