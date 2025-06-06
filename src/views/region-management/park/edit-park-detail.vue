<script setup lang="ts">
import { ref,watch } from "vue";
import { getParkDetail, editPark, addPark } from "@/api/region-management";
import { usePark } from "./hook";
import {formRules} from "./rule";
import { debounce } from "@pureadmin/utils";

import ReUploadImage from "@/components/ReUploadImage/index.vue";
import AddressSelector from "./components/AddressSelector.vue";
import BuildingInfo from "./components/BuildingInfo.vue"

const { treeData, loadTreeData, getSelectedLabels } = usePark();

const mapRef = ref(null);
const formRef = ref(null);

const form = ref({
  name: "",
  regionRelation: "",
  regionRelationLabels: "",
  logo: "",
  coverUrl: "",
  backUrl: "",
  address: "",
  longitude: "",
  latitude: "",
  buildings: []
});

// el-tree-select 配置
const defaultProps = {
    multiple: true,
    label: 'name',
    value: 'id',
    children: 'children' 
  }

watch(() => form.value.address, debounce(() => {
  let { lng, lat } = mapRef.value?.searchAddress(form.value.address);
  form.value.longitude = lng;
  form.value.latitude = lat;
}))

const handleBuildingsUpdate = (newBuildings: Building[]) => {
  form.value.buildings = newBuildings;
}

const onSubmit = () => {
  formRef.value.validate(async valid => {
    
  })
}
</script>
<template>
  <div>
    <el-card  shadow="never">
      <template #header>
        <h3>园区信息</h3>
      </template>
      <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules">
        <el-form-item label="园区名称：" prop="name">
          <el-input
            class="w-[500px]!"
            v-model="form.name"
            placeholder="请输入名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="所属区域：" prop="regionRelation">
          <el-cascader
            v-model="form.regionRelation"
            :options="treeData"
            :props="defaultProps"
            clearable
            filterable
            style="width: 500px"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="logo：" prop="logo" label-position="right">
              <ReUploadImage v-model="form.logo" :multiple="false" :limit="1" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="封面图：" prop="coverUrl" label-position="right">
              <ReUploadImage
                v-model="form.coverUrl"
                :multiple="false"
                :limit="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="背景图：" prop="backUrl">
              <ReUploadImage
                v-model="form.backUrl"
                :multiple="false"
                :limit="1"
              />
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <div class="w-[500px]">
            <el-input
              v-model="form.address"
              placeholder="请输入详细地址"
              id="tipinput"
              clearable
            />
          </div>
        </el-form-item>

        <el-form-item label="坐标：" prop="longitude">
          <div class="w-full">
            <AddressSelector
              v-model="form.longitude"
              v-model:latitude="form.latitude"
              ref="mapRef"
            />
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="mt-[18px]">
        <template #header>
          楼栋信息
        </template>
        <div>
          <BuildingInfo :initial-buildings="form.buildings" @update:buildings="handleBuildingsUpdate"></BuildingInfo>
        </div>
    </el-card>
    <div class="mt-4">
    <el-button type="primary" @click="onSubmit">保存</el-button>
         <el-button type="">取消</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>

</style>
