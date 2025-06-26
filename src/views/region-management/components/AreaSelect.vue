<template>
  <div>
          <el-select
            style="width: 100%"
            v-model="newValue"
            filterable
            clearable
            placeholder="请选择省份"
            v-if="type == 'province'"
          >
            <el-option
              v-for="item in provinceList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            style="width: 100%"
            v-model="newValue"
            filterable
            clearable
            placeholder="请选择市"
            v-else-if="type == 'city'"
          >
            <el-option v-for="item in cityList" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select
            style="width: 100%"
            v-model="newValue"
            filterable
            clearable
            placeholder="请选择县区"
            v-else-if="type == 'district'"
          >
            <el-option
              v-for="item in districtList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            style="width: 100%"
            v-model="newValue"
            filterable
            clearable
            placeholder="请选择街道"
            v-else-if="type == 'street'"
          >
            <el-option
              v-for="item in streetList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
  </div>
</template>
<script setup>
import { reactive, computed, watch } from "vue";
import areaData from "@/assets/area.json";
// const area = reactive({
//   province: "",   // 省
//   city: "",       // 市
//   district: "",   // 区县
//   street: "",     // 街道
// });
const emits = defineEmits(["update:value"]);
const props = defineProps({
  newArea: {
    type: Object,
    default: () => {
      return {
        province: "",   // 省
        city: "",       // 市
        district: "",   // 区县
        street: "",     // 街道
      }
    }
  },
  type: {
    type: String,
    default: "province"
  },
  value: String,
});
const area = reactive(props.newArea);

const newValue = computed({
  get() {
    return props.value;
  },
  set(n) {
    emits("update:value", n);
  }
});

//------省市县区街道四级联动
// 省列表
const provinceList = Object.keys(areaData);
// 市列表
const cityList = computed(() => {
  return area.province ? Object.keys(areaData[area.province]) : [];
});
// 县区列表
const districtList = computed(() => {
  return area.province && area.city
    ? Object.keys(areaData[area.province][area.city])
    : [];
});
// 街道列表
const streetList = computed(() => {
  return area.province && area.city && area.district
    ? areaData[area.province][area.city][area.district]
    : [];
});
// 监听省份变化
watch(
  () => area.province,
  (newVal) => {
    area.city = "";
    area.district = "";
    area.street = "";
  }
);
// 监听市区变化
watch(
  () => area.city,
  (newVal) => {
    area.district = "";
    area.street = "";
  }
);
// 监听县区变化
watch(
  () => area.district,
  (newVal) => {
    area.street = "";
  }
);
</script>


