<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formRules } from "./rule";
import { FormProps } from "./types";
import {
  getOrgNature,
} from "@/api/categories-management";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    id: undefined,
    parentId: 0,
  }),
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const list = ref([]);
function getRef() {
  return ruleFormRef.value;
}

const getList = async() => {
  const { data } = await getOrgNature({
    pageSize: 1000,
    pageNum: 1,
  })
  list.value = data?.records || [];
}
onMounted(() => {
  getList();
});
defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="120px"
  >

    <el-form-item label="上级性质：" v-if="!!newFormInline.parentId" prop="parentId">
      <el-select v-model="newFormInline.parentId" placeholder="请选择">
        <el-option v-for="item in list" :label="item.name" :value="item.id" :key="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="组织性质名称：" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入组织性质名称"
      />
    </el-form-item>
  </el-form>
</template>
