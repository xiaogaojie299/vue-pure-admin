<script setup lang="ts">
import { ref } from "vue";
import { usePark } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Plane from "~icons/ri/plane-line";
import AddFill from "~icons/ri/add-circle-line";
import Refresh from "~icons/ep/refresh";

defineOptions({
  name: "RegionManagementPark"
});

const formRef = ref();
const tableRef = ref();

const {
  filterParams,
  loading,
  statusMap,
  columns,
  dataList,
  treeData,
  selectedNum,
  pagination,
  onSearch,
  resetForm,
  goEditDetail,
  onSelectionCancel,
  onbatchDel,
  openDialog,
  handleCascaderChange,
  handleChangeStatus,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleDelete
} = usePark(tableRef);
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="filterParams"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="园区名称：" prop="name">
        <el-input
          v-model="filterParams.name"
          placeholder="请输入"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="所属区域：" prop="region">
      <el-cascader
        v-model="filterParams.region"
        :options="treeData"
        :props="{ 
          checkStrictly: true, // 允许选择任意一级
          emitPath: true,     // 只返回当前选中的值
          label: 'name',
          value: 'id'
        }"
        @change="handleCascaderChange"
        placeholder="请选择区域"
        clearable
        filterable
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

    <PureTableBar
      title="园区管理"
      :columns="columns"
      @refresh="onSearch"
    >

      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="goEditDetail()"
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
          <template #status="{ row }">
              <el-switch
                v-model="row.status"
                inline-prompt
                :active-value="0"
                :inactive-value="1"
                active-text="展示中"
                disabled
                inactive-text="已隐藏"
              />
          </template>
          <template #operation="{ row }">
                <el-button
                  link
                  type="primary"
                  :size="size"
                  @click="goEditDetail(row.id)"
                >
                  编辑
                </el-button>
                <el-popconfirm title="是否确认删除此园区?" @confirm="handleDelete(row)">
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

                <el-popconfirm :title="`是否${statusMap[row.status]?.reverseLable}确认此园区?`" @confirm="handleChangeStatus(row)">
                  <template #reference>
                    <el-button
                        class="reset-margin"
                        link
                        type="primary"
                        :size="size"

                      >
                        {{ statusMap[row.status]?.reverseLable }}
                      </el-button>
                  </template>
                </el-popconfirm>

          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
