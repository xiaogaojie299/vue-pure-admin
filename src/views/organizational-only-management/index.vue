<template>
  <div>
    <PureTableBar
      title="组织园区列表"
      :columns="columns"
      @refresh="getList"
    >
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
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <div class="flex items-center">
              <div class="" style="width: 20px;height: 20px; color:#409EFF" v-if="row.isMain === 1"> <CircleCheckFilled /> </div>
              <div  style="width: 20px;height: 20px;" v-else> <CircleCheck /> </div>
              <el-button type="primary" link class="ml-2" @click="handleChangeMainPark(row)">设为主园区</el-button>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script lang="tsx" setup>
import { ref, watch, computed, toRaw, reactive ,onMounted} from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import dayjs from "dayjs";
import { getAllOrg } from "@/api/system";
import {http} from "@/utils/http";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { CircleCheckFilled, CircleCheck } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'


const loading = ref(false);
const tableRef = ref();

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
      label: "园区封面图",
      prop: "logo",

      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.logo}
          preview-src-list={Array.of(row.logo)}
          class="w-[100px] h-[50px] rounded align-middle"
        />
      ),
      minWidth: 100
    },
    {
      label: "园区名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
      width: 120
    }
  ];

const dataList = ref([]);
const getList = () => {
  loading.value = true;
  http.request(
    "post",
   "/api/system/park/get-org-park-list",
   {
    data: {
      pageNum: 1,
      pageSize: 1000
    }
   }
  ).then((res) => {
    dataList.value = res.data.records;
  }).finally(() => {
  loading.value = false;
  });
}

const handleChangeMainPark = (item) => {
  http.request(
    "post",
   "/api/system/park/set-main-park",
   {
    data: {
      parkId: item.id
    }
   }
  ).then(() => {
    ElMessage.success("切换成功");
    getList();  
  });
}

onMounted(() => {
  getList();
});
</script>