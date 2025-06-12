<script setup lang="ts">
import { ref, defineOptions, onMounted } from "vue";

import { useOrganManagement } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "./components/Search.vue";

import Delete from "~icons/ep/delete";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({
  name: "PermissionPage"
});

const formRef = ref();
const tableRef = ref();
onMounted(() => {
  onSearch()
})
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  selectedNum,
  onSearch,
  clearAll,
  resetForm,
  onbatchDel,
  handleSizeChange,
  onSelectionCancel,
  handleCurrentChange,
  handleSelectionChange,
  handleGoAdd,
  handleGoEdit,
  handleDelete,
  handleGoDetails,
  handleGoEditLog
} = useOrganManagement(tableRef);
</script>

<template>
  <div class="main">
    <el-card shadow="never">
      <Search @onSearch="onSearch" @resetForm="resetForm" />
    </el-card>

    <PureTableBar title="组织管理" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          @click="handleGoAdd"
          :icon="useRenderIcon(AddFill)"
        >
          新增
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div
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
        </div>
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
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #handle="{row}"> 
            <el-button
              type="primary"
              :size="size"
              @click="handleGoEdit(row)"
              link
            >
              编辑
            </el-button>

            <el-button
              type="primary"
              :size="size"
              link
              @click="handleGoDetails(row)"
            >
              查看详情
            </el-button>

            <el-button
              type="primary"
              :size="size"
              link
            >
              支付方式设置
            </el-button>
            <el-button
              type="primary"
              :size="size"
              link
              @click="handleGoEditLog(row)"
            >
              修改日志
            </el-button>

                <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
                  <template #reference>
                    <el-button
                        class="reset-margin"
                        link
                        type="danger"
                        :size="size"
                      >
                        删除
                      </el-button>
                  </template>
                </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
