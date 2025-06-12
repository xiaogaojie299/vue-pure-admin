<template>
  <div>
    <el-dialog title="选择分类标签" v-model="dialogVisible">
      <div>
    <PureTableBar
      title="组织标签"
      :columns="columns"
      @refresh="onSearch"
    >

      <template  v-slot="{ size, dynamicColumns }">
        <!-- <div
          v-if="selectedNum > 0"
          v-motion-fade
          class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
        >
          <div class="flex-auto">
            <span
              style="font-size: var(--el-font-size-base)"
              class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
            >
              已选 {{ selectedNum }} 项
            </span>
            <el-button type="primary" text @click="onSelectionCancel">
              取消选择
            </el-button>
          </div>
          <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
            <template #reference>
              <el-button type="danger" text class="mr-1!"> 批量删除 </el-button>
            </template>
          </el-popconfirm>
        </div> -->
        <pure-table
          ref="tableRef"
          row-key="id"
          align-whole="center"
          table-layout="auto"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
        </pure-table>
      </template>
    </PureTableBar>
      </div>
      <template #footer>
        <div>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="!selectedNum">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits, watch, reactive, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";

import {
  getOrgTag,
} from "@/api/categories-management";

import dayjs from "dayjs";
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  rowData: {
    type: Object,
    default: () => {}
  }
 
});
const emits = defineEmits(["update:show", "success", "onSelect"]);
const dialogVisible = computed({
  get() {
    return props.show;
  },
  set(n) {
    emits("update:show", n);
  }
});

watch(
  () => dialogVisible.value,
  n => {
    if (n) {
      
    } else {
      
    }
  }
);
  const dataList = ref([]);
  const tableRef = ref();
  const selectedNum = ref(0);
  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns = [
     {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "序号",
      prop: "id",
      minWidth: 60
    },
    {
      label: "标签名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "添加时间",
      prop: "createTime",
      minWidth: 180,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
  ]
  
  const onSearch = () => {
    getList()
  }
  const getList = () => {
    getOrgTag({
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
    }).then((res) => {
      dataList.value = res.data.records;
      pagination.total = res.data.total;
    });
  }
  function handleSelectionChange(val) {
    selectedNum.value = val.length;

    // 重置表格高度
    tableRef.value.setAdaptive();
  }


  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    pagination.pageSize = val;
    getList()
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;
    getList();
  }

  const onSubmit = () => {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    emits('onSelect', curSelected);
    dialogVisible.value = false;
  };

  onMounted(() => {
    onSearch();
  });
</script>
