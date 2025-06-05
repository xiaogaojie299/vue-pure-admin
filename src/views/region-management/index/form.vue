<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./rule";
import { FormProps } from "./types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    showLabel: "",
    status: 1
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
    :rules="formRules"
    label-width="120px"
  >
    <el-form-item label="一级分类名称：">
      一级分类名称
    </el-form-item>
    <el-form-item label="二级分类名称：" >
      二级分类名称
    </el-form-item>
    
    <el-form-item label="分类名称：" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入分类名称"
      />
    </el-form-item>

    <el-form-item label="前端显示名称：" prop="showLabel">
      <el-input
        v-model="newFormInline.showLabel"
        clearable
        placeholder="请输入前端显示名称"
      />
    </el-form-item>
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
  </el-form>
</template>
