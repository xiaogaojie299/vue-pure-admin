<script setup lang="ts">
import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import type { PaginationProps } from "@pureadmin/table";

import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { getOrgEditLogs } from "@/api/organizational-management";

import Plane from "~icons/ri/plane-line";
import AddFill from "~icons/ri/add-circle-line";
import Refresh from "~icons/ep/refresh";

defineOptions({
  name: "OrganizationalManagementEditLog"
});

const filterParams = reactive({
  startTime: "",
  endTime: "",
});
const dataList = ref([]);
const loading = ref(true);
const selectedNum = ref(0);
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

const columns: TableColumnList = [
  {
    label: "序号",
    prop: "id",
    minWidth: 60,
    formatter: (row, column, cellValue, index) => {
      return index + 1;
    }  
  },
  {
    label: "操作人名称",
    prop: "name",
    minWidth: 100
  },
  {
    label: "操作",
    fixed: "right",
    slot: "operation",
    width: 200
  }
];

async function onSearch() {
    loading.value = true;
    const { data } = await getOrgEditLogs(toRaw({ ...filterParams, ...pagination, pageNum: pagination.currentPage })).finally(() => {
      loading.value = false;
    });
    dataList.value = data.records;
    pagination.total = data.total;
  }

function handleSizeChange(val: number) {
  console.log(`${val} items per page`);
  pagination.pageSize = val;
}

function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`);
  pagination.currentPage = val;
}
onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="filterParams"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="修改时间：" prop="startTime">
        <el-date-picker
        v-model="filterParams.startTime"
        type="date"
        placeholder="开始时间"
        class="w-[160px]!"
        value-format="YYYY-MM-DD HH:mm:ss"
        clearable
        
      />
      </el-form-item>

      <el-form-item label="" label-width="0" prop="endTime">
        <el-date-picker
        v-model="filterParams.endTime"
        type="date"
        placeholder="结束时间"
        class="w-[160px]!"
        value-format="YYYY-MM-DD HH:mm:ss"
        clearable
      />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          查询
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="组织修改日志" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          row-key="id"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #status="{ row }">
            <el-switch
              v-model="row.status"
              inline-prompt
              :active-value="0"
              :inactive-value="1"
              active-text="上架"
              disabled
              inactive-text="下架"
            />
          </template>

          <template #operation="{ row }">
            <el-button type="primary" link 
              >查看</el-button
            >
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped></style>
