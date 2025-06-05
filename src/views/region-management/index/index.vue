<script setup lang="tsx">
import { ref, onMounted } from "vue";
import { useRegion } from "./hook";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import AddFill from "~icons/ri/add-circle-line";
defineOptions({
  name: "RegionManagementIndex"
});
const tableRef = ref();
const {
  dataList,
  loadTreeData,
  onSearch,
  openDialog,
  handleDelete,
  handleRowClick
} = useRegion(tableRef);
</script>

<template>
  <div class="industry-category-container">
    <el-card>
      <template #header>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog('新增', { leavel: 0 })"
          >新增一级区域</el-button
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
        <el-table-column prop="country" label="一级区域">
          <template #default="{ row }">
            <span v-if="!row.children" style="margin-left: 10px">{{
              row.country
            }}</span>
            <strong v-else style="color: #333">{{ row.country }}</strong>
          </template>
        </el-table-column>
        <el-table-column prop="province" label="二级区域（省）">
          <template #default="{ row }">
            <span v-if="!row.children" style="margin-left: 10px">{{
              row.province
            }}</span>
            <strong v-else style="color: #333">{{ row.province }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="market" label="三级区域（市）">
          <template #default="{ row }">
            <span v-if="!row.children" style="margin-left: 10px">{{
              row.market
            }}</span>
            <strong v-else style="color: #333">{{ row.market }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="area" label="四级区域（区）">
          <template #default="{ row }">
            <span v-if="!row.children" style="margin-left: 10px">{{
              row.area
            }}</span>
            <strong v-else style="color: #333">{{ row.area }}</strong>
          </template>
        </el-table-column>

        <el-table-column prop="street" label="五级区域（街道）">
          <template #default="{ row }">
            <span v-if="!row.children" style="margin-left: 10px">{{
              row.street
            }}</span>
            <strong v-else style="color: #333">{{ row.street }}</strong>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="right" width="200">
          <template #default="{ row }">
            <el-button
              v-if="row.level < 5"
              link
              size="small"
              type="primary"
              @click="openDialog('新增', row)"
              >添加下级区域</el-button
            >
            <el-button
              link
              size="small"
              type="primary"
              @click="openDialog('编辑', row, 'edit')"
              >编辑</el-button
            >

            <el-popconfirm
              title="是否确认删除此区域吗?"
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
