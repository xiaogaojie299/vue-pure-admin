<script setup lang="tsx">
import { ref, onMounted } from "vue";
import { useIndustryCategory } from "./hook";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import AddFill from "~icons/ri/add-circle-line";
defineOptions({
  name: "IndustryCategory"
});
const tableRef = ref();
const {
  dataList,
  loadTreeData,
  onSearch,
  openDialog,
  handleDelete,
  handleRowClick
} = useIndustryCategory(tableRef);
</script>

<template>
  <div class="industry-category-container">
    <el-card>
      <template #header>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog('新增', { level: 0 })"
          >新增一级分类</el-button
        >
      </template>

      <el-table
        ref="tableRef"
        :data="dataList"
        row-key="id"
        default-expand-all
        highlight-current-row
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @row-click="handleRowClick"
        border
      >
        <el-table-column prop="name" label="分类名称" min-width="500">
          <template #default="{ row }">
            <span v-if="!row.children" style="margin-left: 10px">{{
              row.name
            }}</span>
            <strong v-else style="color: #333">{{ row.name }}</strong>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="right" width="200">
          <template #default="{ row }">
            <el-button
              v-if="row.level < 3"
              link
              size="small"
              type="primary"
              @click="openDialog('新增', row)"
              >添加下级</el-button
            >
            <el-button
              link
              size="small"
              type="primary"
              @click="openDialog('编辑', row, 'edit')"
              >编辑</el-button
            >

            <el-popconfirm
              title="是否确认删除此分类吗?"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button class="reset-margin" link size="small" type="danger"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.industry-category-container {
  padding: 20px;
  background-color: #f9fafb;
}

.el-card {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.el-table {
  font-size: 14px;
}

.el-table__row:hover {
  background-color: #f5f7fa !important;
}
</style>
