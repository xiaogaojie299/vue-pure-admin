<script setup lang="ts">
import { ref } from "vue";
import { useBanner } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Plane from "~icons/ri/plane-line";
import AddFill from "~icons/ri/add-circle-line";
import Refresh from "~icons/ep/refresh";
import {  bannerStatusMap } from "../constants";

defineOptions({
  name: "SystemSettingBanner"
});

const formRef = ref();
const tableRef = ref();

const {
  filterParams,
  loading,
  columns,
  dataList,
  selectedNum,
  pagination,
  handleChangeStatus,
  onSearch,
  resetForm,
  onSelectionCancel,
  onbatchDel,
  openDialog,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleDelete
} = useBanner(tableRef);
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="filterParams"
      class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="banner标题：" prop="name">
        <el-input
          v-model="filterParams.name"
          placeholder="请输入"
          clearable
          class="w-[180px]!"
        />
      </el-form-item>
      <el-form-item label="banner状态：" prop="status">
          <el-select class="w-[200px]!" v-model="filterParams.status" placeholder="全部">
            <el-option :label="'全部'" :value="undefined"></el-option>
            <el-option v-for="item in bannerStatusMap" :key="item.value" :value="item.value" :label="item.showLabel"
          ></el-option>
          </el-select>
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
      title="banner管理"
      :columns="columns"
      @refresh="onSearch"
    >

      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog('新增', { username: ''})"
        >
          添加banner
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
                active-text="上架"
                disabled
                inactive-text="下架"
              />
          </template>

          <template #operation="{ row }">


                <el-popconfirm :title="`是否${bannerStatusMap[row.status]?.reverseLable}确认此banner?`" @confirm="handleChangeStatus(row)">
                  <template #reference>
                    <el-button
                        class="reset-margin"
                        link
                        type="primary"
                        :size="size"

                      >
                        {{ bannerStatusMap[row.status]?.reverseLable }}
                      </el-button>
                  </template>
                </el-popconfirm>

                <el-button
                  link
                  type="primary"
                  :size="size"
                  @click="openDialog('编辑', row)"
                >
                  编辑
                </el-button>
                <el-button type="primary" link @click="openDialog('预览', row)">详情</el-button>
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
