<template>
  <div class="building-info">
    <el-button type="primary" @click="addBuilding">添加</el-button>
    <el-card v-for="(building, buildingIndex) in buildings" :key="buildingIndex" class="building-card">
      <template #header>
        <div class="flex justify-between items-center">
          <span>楼栋 {{ buildingIndex + 1 }}</span>
          <el-button link type="danger" @click="deleteBuilding(buildingIndex)">删除</el-button>
        </div>
      </template>
      <el-form :model="building" :rules="buildingRules" :ref="(el) => setBuildingFormRef(el, buildingIndex)">
        <el-form-item label="楼栋名称：" prop="buildingName">
          <el-input class="w-[400px]! mr-[12px]" v-model="building.buildingName" placeholder="请输入" clearable></el-input>
          <el-button type="primary" @click="addUnit(buildingIndex)">添加单元</el-button>
        </el-form-item>

        <el-row v-for="(unit, unitIndex) in building.units" :key="unitIndex" :gutter="10" class="unit-row">
          <el-col :span="6">
            <el-form-item :label="`单元名称：`" :prop="`units.${unitIndex}.unitName`" :rules="unitRules.unitName">
              <el-input v-model="unit.unitName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`楼层数：`" :prop="`units.${unitIndex}.floor`" :rules="unitRules.floor">
              <el-input v-model="unit.floor" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="unit-delete">
            <el-button link type="danger" @click="deleteUnit(buildingIndex, unitIndex)">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, defineProps, defineEmits, defineExpose, nextTick } from 'vue';
import type { FormInstance } from 'element-plus';
import { message } from '@/utils/message';

interface Unit {
  unitName: string;
  floor: string;
}

interface Building {
  buildingName: string;
  units: Unit[];
}

interface TransformedItem {
  name: string;
  unitName: string;
  floor: string;
}

// 定义 props 接收外部传入的初始楼栋数据
const props = defineProps({
  initialBuildings: {
    type: Array as () => Building[],
    default: () => []
  }
});

// 定义 emit 事件，用于通知父组件楼栋信息的变化
const emit = defineEmits(['update:buildings']);

const buildings = ref<Building[]>(props.initialBuildings);

const buildingFormRefs = ref<(FormInstance | undefined)[]>([]);

const buildingRules = {
  buildingName: [
    { required: true, message: '楼栋名称不能为空', trigger: 'blur' },
  ],
};

const unitRules = {
  unitName: [
    { required: true, message: '单元名称不能为空', trigger: 'blur' },
  ],
  floor: [
    { required: true, message: '楼层数不能为空', trigger: 'blur' },
  ],
};


function transformBuildingData(buildings: Building[]): TransformedItem[] {
  const result: TransformedItem[] = [];

  for (const building of buildings) {
    let _units = building?.units || []
    if (_units.length > 0) {
        for (const unit of _units) {
          result.push({
            name: building.buildingName,
            unitName: unit?.unitName,
            floor: unit.floor
          });
        }
    } else {
        result.push({
          name: building.buildingName,
        });
      }
  }

  return result;
}
const addBuilding = async () => {
  buildings.value.push({
    buildingName: '',
    units: [],
  });
  await nextTick(); // 等待 DOM 更新

  emit('update:buildings', buildings.value);
};

const deleteBuilding = (buildingIndex: number) => {
  buildings.value.splice(buildingIndex, 1);
  emit('update:buildings', buildings.value);
};

const addUnit = async (buildingIndex: number) => {
  buildings.value[buildingIndex].units.push({
    unitName: '',
    floor: '',
  });
  await nextTick(); // 等待 DOM 更新
  emit('update:buildings', buildings.value);
};

const deleteUnit = (buildingIndex: number, unitIndex: number) => {
  buildings.value[buildingIndex].units.splice(unitIndex, 1);
  emit('update:buildings', buildings.value);
};

// 设置 buildingFormRefs 的引用
const setBuildingFormRef = (el: FormInstance | undefined, index: number) => {
   if (index >= 0 && index < buildings.value.length) {
    // 使用 Vue.set 或数组的 splice 替代直接赋值以保证响应性
    buildingFormRefs.value.splice(index, 1, el);
  }
};

  watch(
    () => props.initialBuildings,
    (newBuildings) => {
      buildings.value = newBuildings;
      // 当 buildings 更新时，重置 formRefs 数组
      buildingFormRefs.value = Array(newBuildings.length).fill(undefined);
    },
    { deep: true, immediate: true }
  );

// 校验所有楼栋表单
const validateBuildings = async (): Promise<boolean> => {
  if (buildings.value.length === 0) {
    message('楼栋信息：必须配置一个', { type: 'error' });
    return false;
  }

  let isValid = true;
  for (let i = 0; i < buildings.value.length; i++) {
    const formRef = buildingFormRefs.value[i];
    if (!formRef) {
      isValid = false;
      break;
    }

    try {
      const valid = await formRef.validate();
      if (!valid) {
        isValid = false;
        break;
      }
    } catch (error) {
      isValid = false;
      break;
    }
  }

  return isValid;
};

// 暴露 validateBuildings 方法给父组件
defineExpose({ validateBuildings, transformBuildingData });
</script>

<style scoped lang="scss">
.building-info {
  .el-button:hover {
    background-color: #66b1ff;
    color: #fff;
  }

  .building-card {
    margin-top: 20px;
    width: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
    }

    &:first-child {
      margin-top: 0;
    }
  }

  .el-form-item {
    margin-bottom: 20px;

    .el-input:hover {
      border-color: #66b1ff;
    }
  }

  .unit-row {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
