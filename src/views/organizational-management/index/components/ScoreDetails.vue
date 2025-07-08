<template>
  <div>
      <el-card shadow="never" v-for="item in groupedData" :key="item.id" class="mb-2">
        <template #header>
          <h3>{{ titleMap?.get(item[0]?.moduleType) }} </h3>
        </template>
        <el-descriptions title="" border  :column="3" label-width="300">
          <el-descriptions-item v-for="info in item" :label="info.name" :key="info.id" >
            <template v-if="info.fieldType === 3">
             
              <div v-if="!!info.submitValue"> {{ info.submitValue === 1 ?'是' : '否'}}</div>
              <div v-else>-</div>
            </template>
            <template v-else-if="[1, 2, 4].includes(info.fieldType)">
            <template v-if="!isEmptyObject(info.values)">
                <span v-for="(value, key) in info.values" :key="key">
                  {{ key }}：{{ value || '-' }}&nbsp;&nbsp;
                </span>
              </template>
              <template v-else>
                {{  info.submitValue || '-' }}
              </template>
            </template>
          </el-descriptions-item>
        </el-descriptions>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, computed, reactive,onMounted, defineProps } from 'vue'
import resp from './data.json'
import { groupByModuleType, isEmptyObject } from "@/utils/common"
import {http} from "@/utils/http";

const props = defineProps({
  orgId: {
    type: Number,
    default: 0
  }
})

const groupedData = ref([])
const titleMap = new Map([
  [1, "基础信息"],
  [2, "技术创新"],
  [3, "成长经营"],
  [4, "辅助指标"],
  [5, "加分指标"],
  [6, "负面指标"],
])
const breakFaithOptions = [
  {
    label: '守信组织（企业）',
    value: 1,
  },
  {
    label: '信用异常组织（企业）',
    value: 2,
  },
  {
    label: '一般失信组织（企业）',
    value: 3,
  },
  {
    label: '严重失信组织（企业）',
    value: 4,
  },
]
// 1=守信组织，2=信用异常组织，3=一般失信组织，4=严重失信组织
const executionerOptions = [
  { label: '存续', value: 1 },
  { label: '在业', value: 2 },
  { label: '吊销', value: 3 },
  { label: '注销', value: 4 },
  { label: '迁入', value: 5 },
  { label: '迁出', value: 6 },
  { label: '停业', value: 7 },
  { label: '清算', value: 8 },
]
const transformData = (data: any[]) => {
  const transformedData = [];

  // 遍历数据，按 name 分组
  const groupedByName = data.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {} as Record<string, any[]>);
 console.log("groupedByName", groupedByName);
  // 处理每个分组
  for (const groupName in groupedByName) {
    const group = groupedByName[groupName];
    const values: Record<string, string> = {};

    // 提取每个分组的值
    group.forEach(item => {
      switch (item.remark) {
        case '金牌数量':
          values['金'] = item.submitValue;
          break;
        case '银牌数量':
          values['银'] = item.submitValue;
          break;
        case '铜牌数量':
          values['铜'] = item.submitValue;
          break;
      }
      switch (item.configKey) {
        case 47:
          values['一等'] = item.submitValue;
          break;
        case 48:
          values['二等'] = item.submitValue;
          break;
        case 49:
          values['三等'] = item.submitValue;
          break;
        case 58:
          if (item.submitValue === '0') {
            values['-'] = '';
          } else if (!!item.submitValue) {
            values[breakFaithOptions[item.submitValue - 1]?.label] = '';
            }
          break;
        case 63:
        if (item.submitValue === '0') {
            values['-'] = '';
          }else if(!!item.submitValue) {
              values[executionerOptions[item.submitValue - 1]?.label] = '';
            }
          break;

      }
    });

    // 构建最终对象
    transformedData.push({
      name: groupName,
      values: values,
      ...group[0]
    });
  }

  return transformedData;
};

const initData = () => {
  http.request('post', '/api/program/score/get-org-index', {
    data: {
      orgId: props.orgId
    } 
  }).then(resp => {
    const responseData = resp.data;
    const transformedList = transformData(responseData);

    // 调用函数归类
    const list = groupByModuleType(transformedList);
    groupedData.value = list;
    console.log('groupedData.value', groupedData.value)
  })
}

watch(() => props.orgId, async (n) => {
  console.log('props.orgId', n)
  // if(!n) return;
  initData()
}, {
  deep: true,
  immediate: true
})

onMounted(() => {
  // initData();
})
</script>