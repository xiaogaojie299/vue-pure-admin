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
      <el-form :model="building" :rules="buildingRules" ref="buildingFormRefs[buildingIndex]">

        <el-form-item label="楼栋名称：" prop="buildingName">
          <el-input class="w-[400px]! mr-[12px]" v-model="building.buildingName" placeholder="请输入"></el-input>
          <el-button type="primary" @click="addUnit(buildingIndex)">添加单元</el-button>
        </el-form-item>

        <el-row v-for="(unit, unitIndex) in building.units" :key="unitIndex" :gutter="10" class="unit-row">
          <el-col :span="6">
            <el-form-item :label="`单元名称：`" :prop="`units.${unitIndex}.unitName`" :rules="unitRules.unitName">
              <el-input v-model="unit.unitName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="`楼层数：`" :prop="`units.${unitIndex}.floorCount`" :rules="unitRules.floorCount">
              <el-input v-model.number="unit.floorCount" placeholder="请输入"></el-input>
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
import { ref, reactive, onMounted, watch, defineProps, defineEmits } from 'vue';
import type { FormInstance } from 'element-plus';

interface Unit {
  unitName: string;
  floorCount: number;
}

interface Building {
  buildingName: string;
  units: Unit[];
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
  floorCount: [
    { required: true, message: '楼层数不能为空', trigger: 'blur' },
    { type: 'number', message: '楼层数必须为数字', trigger: 'blur' },
  ],
};

const addBuilding = () => {
  buildings.value.push({
    buildingName: '',
    units: [],
  });
  emit('update:buildings', buildings.value);
};

const deleteBuilding = (buildingIndex: number) => {
  buildings.value.splice(buildingIndex, 1);
  emit('update:buildings', buildings.value);
};

const addUnit = (buildingIndex: number) => {
  buildings.value[buildingIndex].units.push({
    unitName: '',
    floorCount: 0,
  });
  emit('update:buildings', buildings.value);
};

const deleteUnit = (buildingIndex: number, unitIndex: number) => {
  buildings.value[buildingIndex].units.splice(unitIndex, 1);
  emit('update:buildings', buildings.value);
};

// 初始化表单实例数组
onMounted(() => {
  watch(buildings, () => {
    buildingFormRefs.value = Array(buildings.value.length).fill(undefined);
  }, { deep: true });
});
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