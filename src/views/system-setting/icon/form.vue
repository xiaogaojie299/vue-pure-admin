<script setup lang="ts">
import { ref, watch } from "vue";
import ReUploadImage from "@/components/ReUploadImage/index.vue";
import Editor from "@/components/Editor.vue";

import { formRules } from "./rule";
import { FormProps } from "./types";
import {  iconTypeMap, iconJumpType } from "../constants";

import {
  getPark,
} from "@/api/region-management";
import { getFieldValueById } from "@/utils/common";


const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",     // icon名称
    startTime: "",  // 生效开始时间
    endTime: "",    // 生效结束时间
    status: "",     // 状态（0上架 1下架）
    type: "",       // 所属板块 1公共服务 2空间服务 3科技服务
    coverUrl: "", // 图片
    jumpContent: '', // 跳转内容
    jumpType: '', // 跳转类型
    sortNum: "",    // 排序
    typeID: "",
    typeOneId: "",
    typeTwoId: "",
    typeThreeId: "",
    remark: ""   // 功能说明
  }),
  isWatch: ()  => false
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
// const isPreview = ref(props.isWatch);
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
    label-width="122px"
    :disabled="isWatch"
  >
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label="icon名称：" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入banner名称"
          />
        </el-form-item>
      </el-col>
        <el-col :span="10">
          <el-form-item label="icon排序：" prop="sortNum">
            <el-input
              v-model="newFormInline.sortNum"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
    </el-row>
      <el-row :gutter="30">
        <el-col :span="10">
          <el-form-item label="ICON图标：" prop="coverUrl">
            <ReUploadImage v-model="newFormInline.coverUrl" :multiple="false" :limit="1" />
          </el-form-item>
        </el-col>

          <el-col :span="10">
            <el-form-item label="所属板块：" prop="type">
               <el-select v-model="newFormInline.type" placeholder="请选择">
                <el-option v-for="item in iconTypeMap" :key="item.value" :label="item.showLabel" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="10">
          <el-form-item label="是否上架：" prop="status">
           <el-radio-group v-model="newFormInline.status">
               <el-radio :label="0">是</el-radio>
               <el-radio :label="1">否</el-radio>
           </el-radio-group>
          </el-form-item>
        </el-col>
      <el-col :span="10">
        <el-form-item label="时间设置：">
          <div class="flex items-center">
            <el-form-item prop="startTime" label-width="0">
              <el-date-picker
                v-model="newFormInline.startTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
                placeholder="开始时间"
              >
              </el-date-picker>
            </el-form-item>
            <span class="mx-2">至</span>
            <el-form-item prop="endTime" label-width="0">
              <el-date-picker
                v-model="newFormInline.endTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form-item>
      </el-col>
      </el-row>
      <el-row>
        <el-form-item label="跳转板块："  prop="jumpType">
          <el-radio-group v-model="newFormInline.jumpType" name="jumpType">
            <el-radio  v-for="item in Object.values(iconJumpType)" :key="item.value" :label="item.value">{{ item.showLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row  v-if="[1, 2, 3].includes(newFormInline.jumpType)">
        <el-form-item label="列表分类：">
        </el-form-item>
        <el-form-item label-width="0" prop="typeOneId" >
            <el-select class="w-[160px]!" v-model="newFormInline.typeOneId" placeholder="请选择" >
              <el-option label="一级分类" :value='1'></el-option>
            </el-select>
          </el-form-item>
        <el-form-item class="mx-2" label-width="0" prop="typeTwoId">
          <el-select class="w-[160px]!" v-model="newFormInline.typeTwoId" placeholder="请选择" >
            <el-option label="二级分类" :value='2'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="0" prop="typeThreeId">
          <el-select class="w-[160px]!" v-model="newFormInline.typeThreeId" placeholder="请选择" >
            <el-option label="三级分类" :value='3'></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row >
          <el-form-item label="跳转内容："  v-if="[4,5,6,7].includes(newFormInline.jumpType)"  prop="jumpContent">
            <el-input v-model="newFormInline.jumpContent" placeholder="请选择" clearable></el-input>
          </el-form-item>
        <el-form-item label="功能说明：" v-if="[8].includes(newFormInline.jumpType)">
          <Editor v-model="newFormInline.remark"></Editor>
        </el-form-item>
      </el-row>
  </el-form>
</template>
