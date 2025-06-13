<script setup lang="ts">
import { ref } from "vue";
import { useOrgTags } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Plane from "~icons/ri/plane-line";
import AddFill from "~icons/ri/add-circle-line";
import Refresh from "~icons/ep/refresh";

defineOptions({
  name: "CategoriesManagementOrgTags"
});

const formRef = ref();
const tableRef = ref();

const {
  filterParams,
  statusMap,
  loading,
  columns,
  dataList,
  selectedNum,
  pagination,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleGoOrgAudit
} = useOrgTags(tableRef);
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="filterParams"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
    <el-form-item label="认证人：" prop="authName">
        <el-input
          v-model="filterParams.authName"
          placeholder="请输入"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="联系电话：" prop="mobile">
        <el-input
          v-model="filterParams.mobile"
          placeholder="请输入"
          clearable
          class="w-[180px]!"
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
      title="加入组织申请"
      :columns="columns"
      @refresh="onSearch"
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
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
        <template #status="{row}">
          <span>{{ statusMap[row.status]?.showLabel }}</span>
        </template>
          <template #operation="{ row }">
                <el-button
                  link
                  type="primary"
                  :size="size"
                  @click="handleGoOrgAudit(row)"
                >
                  {{ row.status === 0 ? '去处理' : '查看详情' }} 
                </el-button>
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
