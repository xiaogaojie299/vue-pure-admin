<script setup lang="ts">
import { ref } from "vue";
import { useUser } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Upload from "~icons/ri/upload-line";
import Role from "~icons/ri/admin-line";
import Password from "~icons/ri/lock-password-line";
import More from "~icons/ep/more-filled";
import Delete from "~icons/ep/delete";
import EditPen from "~icons/ep/edit-pen";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";

defineOptions({
  name: "SystemUserTourist"
});

const treeRef = ref();
const formRef = ref();
const tableRef = ref();

const {
  form,
  loading,
  columns,
  dataList,
  treeData,
  treeLoading,
  selectedNum,
  pagination,
  buttonClass,
  deviceDetection,
  currentValue,
  optionsBasis,
  onSearch,
  resetForm,
  onTreeSelect,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleChangeStatus,
  handleReview,
  handleChangeAreaCasder
} = useUser(tableRef, treeRef);
</script>

<template>
  <div>
    <div>
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color w-full pl-8 pt-[12px] overflow-auto"
      >
        <div class="custom-style mb-3">
          <el-segmented
            v-model="currentValue"
            :options="optionsBasis"
            @change="
              () => {
                pagination.currentPage = 1;
                onSearch();
              }
            "
          >
            <template #default="scope">
              <div :class="['flex', 'items-center', 'px-10', 'py-2']">
                <div>{{ scope.item.label }}</div>
              </div>
            </template>
          </el-segmented>
        </div>
        <el-form-item label="手机电话：" prop="mobile">
          <el-input
            v-model="form.mobile"
            placeholder="请输入"
            clearable
            class="w-[180px]!"
          />
        </el-form-item>
        <el-form-item label="用户昵称：" prop="nickName">
          <el-input
            v-model="form.nickName"
            placeholder="用户昵称"
            clearable
            class="w-[180px]!"
          />
        </el-form-item>
            <el-form-item label="注册时间："  prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="开始时间"
                class="w-[160px]!"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>

            <el-form-item label="" label-width="0" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="结束时间"
                class="w-[160px]!"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
          </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri/search-line')"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar title="组织用户管理" :columns="columns" @refresh="onSearch">
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
                <el-button type="danger" text class="mr-1!">
                  批量删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <pure-table
            ref="tableRef"
            row-key="id"
            adaptive
            :adaptiveConfig="{ offsetBottom: 108 }"
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
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
            <template #sort="{ $index }">
              <div>{{ $index + 1 }}</div>
            </template>
            <template #operation="{ row }">
              <el-button
                type="primary"
                :size="size"
                link
                @click="handleChangeStatus(row)"
                >{{ row.status == 0 ? "停用" : "启用" }}</el-button
              >
              <el-button
                type="primary"
                :size="size"
                link
                @click="handleReview(row)"
                >详情</el-button
              >
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
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
