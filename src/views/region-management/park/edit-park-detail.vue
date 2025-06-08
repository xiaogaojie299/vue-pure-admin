<script setup lang="ts">
import { TOAST_TITLE_SUCCESS } from "@/constants";

import { computed, nextTick, onMounted, ref, watch } from "vue";
import { getParkDetail, editPark, addPark } from "@/api/region-management";
import { useTree } from "../treeHook";
import { formRules } from "./rule";
import { debounce, isArray } from "@pureadmin/utils";

import ReUploadImage from "@/components/ReUploadImage/index.vue";
import AddressSelector from "./components/AddressSelector.vue";
import BuildingInfo from "./components/BuildingInfo.vue";
import { message } from "@/utils/message";

import { useRouter, useRoute } from "vue-router";

const { treeData, loadTreeData, getSelectedLabels } = useTree();


const router = useRouter();
const route = useRoute();

const mapRef = ref(null);
const formRef = ref(null);
const buildingInfoRef = ref(null);
let buildingTemplate =  [
    {
      buildingName: "",
      units: []
    }
  ]
const form = ref({
  name: "",
  regionRelation: "",
  regionRelationName: "",
  logoUrl: "",
  coverUrl: "",
  backUrl: "",
  address: "",
  longitude: "",
  latitude: "",
  buildings: buildingTemplate
});

// el-tree-select 配置
const defaultProps = {
  multiple: true,
  label: "name",
  value: "id",
  children: "children"
};

watch(
  () => form.value.address,
  debounce(() => {
    let { lng, lat } = mapRef.value?.searchAddress(form.value.address);
    form.value.longitude = lng;
    form.value.latitude = lat;
  })
);
const initData = () => {
  if (!parkId.value) return;
  getParkDetail({
    id: parkId.value
  }).then(resp => {

    let response = resp.data;
    let buildings = response.buildingDetail;
    let regionRelation = response.regionRelation;
    try {
      buildings = JSON.parse(buildings);
    } catch (error) {
      buildings = '';
    }
    if (!buildings || !isArray(buildings) || buildings.length === 0) {
      buildings = buildingTemplate
    } else {
      buildings = transformFlattenToNested(buildings)
    }
    console.log('buildings', buildings)
    form.value = {
      ...response,
      regionRelation: convertStringToArray(regionRelation),
      buildings:  buildings
    };

  })
};
const parkId = computed(() => {
  return route.query.id || undefined;
});
onMounted(async () => {
  nextTick(() => {
    loadTreeData()
  });
  initData();
});

const handleBuildingsUpdate = (newBuildings: Building[]) => {
  form.value.buildings = newBuildings;
};

// [ [1, ,2, 3], [4, 5, 6] ] 转换为 "1&2&3,4&5&6"
function convertArrayToString(arr: (number | undefined)[][], key='&'): string {
  return arr
    .map(subArr => 
      subArr
        .filter(item => item !== undefined && item !== null) // 过滤掉 undefined 和 null
        .join(key) // 子数组用 & 拼接
    )
    .join(','); // 用 , 拼接每个子数组的结果
}
// "1&2&3,4&5&6" 转换为 [ [1, ,2, 3], [4, 5, 6] ]
function convertStringToArray(str: string, key='&'): number[][] {
  return str.split(',').map((group) => {
    return group.split(key).map(Number);
  });
}

function transformFlattenToNested(data: FlattenedItem[]): NestedBuilding[] {
  
  const map = new Map<string, NestedBuilding>();
  console.log("data", data);
  for (const item of data) {
    const key = item.name;

    if (!map.has(key)) {
      map.set(key, {
        buildingName: key,
        units: []
      });
    }

    const building = map.get(key)!;
    if (item.floor) {
      building.units.push({
        floor: item.floor
      });
    } else if (item.unitName) {
      building.units.push({
        unitName: item.unitName,
      });
    } else {
      building.buildingName = item.name;
    }
    
  }
  return Array.from(map.values());
}

const onSubmit = async () => {
  let valid = await formRef.value.validate();
  if (!valid) return;

  // 校验楼栋表单
  const isBuildingsValid = await buildingInfoRef.value?.validateBuildings();
  if (!isBuildingsValid) {
    return;
  }

  let buildingDetail = buildingInfoRef.value?.transformBuildingData(
    form.value.buildings
  );
  console.log('buildingDetail', form.value.buildings);

  console.log('buildingDetail', buildingDetail);
  let regionRelationName = form.value?.regionRelation?.map(item => {
    return getSelectedLabels(treeData.value, item);
  })
  let params = {
    ...form.value,
    regionRelation: convertArrayToString(form.value?.regionRelation),
    regionRelationName: convertArrayToString(regionRelationName, '-'),
    buildingDetail: JSON.stringify(buildingDetail)
  };
  delete params.buildings;

  let apiFn = !parkId.value ? addPark : editPark;
  apiFn(params).then(resp => {
    message(TOAST_TITLE_SUCCESS);
    router.go(-1);
  });
};
</script>
<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <h3>园区信息</h3>
      </template>
      <el-form
        ref="formRef"
        :model="form"
        label-width="120px"
        :rules="formRules"
      >
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
            <el-form-item label="logo：" prop="logoUrl" label-position="right">
              <ReUploadImage v-model="form.logoUrl" :multiple="false" :limit="1" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="封面图："
              prop="coverUrl"
              label-position="right"
            >
              <ReUploadImage
                v-model="form.coverUrl"
                :multiple="false"
                :limit="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="背景图：" prop="backUrl">
          <ReUploadImage v-model="form.backUrl" :multiple="false" :limit="1" />
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
      <template #header> 楼栋信息 </template>
      <div>
        <BuildingInfo
          :initial-buildings="form.buildings"
          @update:buildings="handleBuildingsUpdate"
          ref="buildingInfoRef"
        ></BuildingInfo>
      </div>
    </el-card>
    <div class="mt-4">
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button type="">取消</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
