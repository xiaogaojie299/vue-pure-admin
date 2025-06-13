<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { getScoreSetList, editScoreSet } from "@/api/organizational-management";
import { message } from "@/utils/message";

interface ScoreSet {
  id: number;
  type: string;
  name: string;
  childName: string | null;
  beginValue: number;
  growValue: number;
  staValue: number;
  referValue: number;
  updateTime: string | null;
  createTime: string;
}

const scoreSetList = ref<ScoreSet[]>([]);
const loading = ref<boolean>(true);

const titleMap = [
  "技术创新指标",
  "成长经营指标",
  "辅助指标",
  "加分指标",
  "负面指标",
  ""
];

onMounted(() => {
  getScoreSetList().then(response => {
    scoreSetList.value = response.data;
    console.log("scoreSetList", scoreSetList);

    loading.value = false;
    const tempGroupedData: { [key: string]: ScoreSet[] } = {};
    scoreSetList.value.forEach(item => {
      if (!tempGroupedData[item.type]) {
        tempGroupedData[item.type] = [];
        types.value.push(item.type);
      }
      tempGroupedData[item.type].push(item);
    });
    groupedData.value = tempGroupedData;
  });
});

// 分组数据
const groupedData = ref<{ [key: string]: ScoreSet[] }>({});
const types = ref<string[]>([]);

// 表头合并方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
};

const updateScoreSet = (row: any ) => {
  editScoreSet(row).then((res) => {
      message('添加成功', {type: 'success'});
  });
};
</script>

<template>
  <div v-loading="loading">
    <div v-for="(type, index) in types" :key="type" class="mb-4">
      <el-card shadow="hover">
        <template #header>
          <h3>
            {{ titleMap[index] }}
          </h3>
        </template>
        <div>
          <el-table
            :data="groupedData[type]"
            border
            style="width: 100%"
            :span-method="objectSpanMethod"
          >
            <el-table-column
              type="index"
              label="序号"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="评分项"
              width="400"
            ></el-table-column>
            <el-table-column label="二级权重指标" width="450">
              <el-table-column prop="beginValue" label="初创期" width="">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.beginValue"
                    controls-position="right"
                    :step="1"
                    @change="value => updateScoreSet(row)"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="growValue" label="成长期" width="">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.growValue"
                    controls-position="right"
                    :step="1"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="staValue" label="稳定期" width="">
                <template #default="{ row }">
                  <el-input-number
                    v-model="row.staValue"
                    controls-position="right"
                    :step="1"
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="referValue" label="满分值参考" width="160">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.referValue"
                  controls-position="right"
                  :step="1"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped></style>
