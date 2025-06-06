<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./rule";
import { FormProps } from "./types";
import ReUploadImage from "@/components/ReUploadImage/index.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    frontName: "",
    status: 1,
    countryType: 1, // 国家类型
    type: 1,    // 国家类型
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
    <!-- 一级分类名称 -->
    <el-form-item label="上级区域：" v-if="newFormInline?.parentNames[0]">
      <span class="form-display-text">{{ newFormInline?.parentNames?.join(' - ') }}</span>
    </el-form-item>

    <template v-if="newFormInline.level == 1">
      <el-form-item label="一级区域" prop="type">
        <el-radio-group v-model="newFormInline.type" class="ml-4">
          <el-radio :label="1">国内</el-radio>
          <el-radio :label="2">国外</el-radio>
        </el-radio-group>
      </el-form-item>
    </template> 

    <!-- 如果newFormInline.type == 2 是国外的时候，这显示 请输入外国名称 -->
    <el-form-item v-if="newFormInline.type == 2" label="外国名称" prop="country">
      <el-input v-model="newFormInline.country"></el-input>
    </el-form-item>

    <!-- 公司logo -->
    <el-form-item label="logo：" prop="logo">
      <div>
        <ReUploadImage v-model="newFormInline.logo" :multiple="false" :limit="1" />
      </div>
    </el-form-item>
    <template  v-if="newFormInline.level == 2" >
      <el-form-item label="二级区域" prop="province">
        <el-input v-model="newFormInline.province" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </template>
    <template  v-else-if="newFormInline.level == 3" >
      <el-form-item label="三级区域" prop="market">
        <el-input v-model="newFormInline.market" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </template>
    <template  v-else-if="newFormInline.level == 4" >
      <el-form-item label="四级区域" prop="area">
        <el-input v-model="newFormInline.area" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </template>
    <template  v-else-if="newFormInline.level == 5" >
      <el-form-item label="五级区域" prop="street">
        <el-input v-model="newFormInline.street" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </template>
    <template v-if="newFormInline.level > 1">
      <!-- 联系人姓名： -->
      <el-form-item label="联系人姓名：" prop="contactName">
        <el-input v-model="newFormInline.contactName" placeholder="请输入联系人姓名" />
      </el-form-item>
      <!-- 联系人电话： -->
      <el-form-item label="联系人电话：" prop="contactMobile">
        <el-input v-model="newFormInline.contactMobile" placeholder="请输入联系人电话" />
      </el-form-item>
    </template>
  </el-form>
</template>