<script setup lang="ts">
import { ref } from "vue";
import ReUploadImage from "@/components/ReUploadImage/index.vue";

import { formRules } from "./rule";
import { FormProps } from "./types";
import {  bannerTypeMap, bannerRedirectTypeMap } from "../constants";

import {
  getPark,
} from "@/api/region-management";
import { getFieldValueById } from "@/utils/common";


const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    times: "",
    startTime: "",
    endTime: "",
    status: "",
    type: "",
    coverUrl: "", // 图片
    redirectContent: '', // 跳转内容
    redirectType: '', // 跳转类型
    sortNum: "",    // 排序
    regionId: ""
  }),
  isWatch: ()  => false
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
  const parkList = ref([]);

function getRef() {
  return ruleFormRef.value;
}

function getRegionName() {
  return getFieldValueById(parkList.value,newFormInline.value.regionId, "name");
}


  const getParkList = () => {
    getPark({
      pageNum: 1,
      pageSize: 1000,
    }).then((res) => {
      parkList.value = res.data.records;
    });
  }

  getParkList();

defineExpose({ getRef, getRegionName });
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
        <el-form-item label="banner名称：" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入banner名称"
          />
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
      <el-row :gutter="30">
        <el-col :span="10">
          <el-form-item label="展示园区：" prop="regionId">
            <el-select
              v-model="newFormInline.regionId"
              placeholder="请选择"
            >
              <el-option v-for="item in parkList" :key="item.id" :label="item.name" :value="item.id">

              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="10">
          <el-form-item label="banner排序：" prop="sortNum">
            <el-input
              v-model="newFormInline.sortNum"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否上架：" prop="status">
           <el-radio-group v-model="newFormInline.status">
               <el-radio :label="0">是</el-radio>
               <el-radio :label="1">否</el-radio>
           </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="30">
        <el-col :span="10">
          <el-form-item label="跳转类型：" prop="type">
           <el-radio-group v-model="newFormInline.type">
              <el-radio v-for="(item, index) in bannerTypeMap" :key="index" :label="item.value">{{ item.showLabel }}</el-radio>
           </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="banner图片：" prop="coverUrl">
            <ReUploadImage v-model="newFormInline.coverUrl" :multiple="false" :limit="1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item label="跳转板块：" prop="redirectType">
              <el-select v-model="newFormInline.redirectType" placeholder="请选择">
                  <el-option v-for="item in bannerRedirectTypeMap" :key="item.value" :label="item.showLabel" :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item label="跳转内容："  prop="redirectContent">
              <el-input v-model="newFormInline.redirectContent" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
      </el-row>
      <div class="text-center mt-2">
      </div>
  </el-form>
</template>
