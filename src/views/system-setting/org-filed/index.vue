<script setup lang="ts">
import { defineOptions, ref } from "vue";
import { useOrgFilde } from "./hook.tsx";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  orgFileTypeList,
  STATUS_ORG_FIELD_OFF,
  STATUS_ORG_FIELD_ON,
  EDIT_ORG_FIELD_OFF,
  EDIT_ORG_FIELD_ON,
  editOrgFieldList
} from "../constants.ts";

import AddFill from "~icons/ri/add-circle-line";

defineOptions({
  name: ""
});
const {
  isFirstMenu,
  menuItems,
  currentMenu,
  natureList,
  tableData,
  openDialog,
  handleChangeStatus,
  handleChangeMenu,
  handleblurOfRemark,
  handleAddField,
  handleSubmit
} = useOrgFilde();

// el-tree-select 配置
const defaultProps = {
  multiple: true,
  label: "name",
  value: "id",
  children: "children"
};
const handleChangeOrgType = (row, key='orgTypeId') => {
  const selectedValues = [...(row[key] || [])]; // 拷贝一份避免直接修改 props

  // 判断是否包含 "all"
  const hasSelectAll = selectedValues.some(path => path.includes('0'));

  if (hasSelectAll) {
    // 如果选中了 "全选"，则只保留它
    row[key] = [['0']];
  } else {
    // 否则确保没有残留的 "全选" 节点（比如手动输入或粘贴等边界情况）
    const filtered = selectedValues.filter(path => !path.includes('0'));
    row[key] = filtered;
  }
};

</script>

<template>
  <div class="flex h-[90%]">
    <!-- 左侧菜单栏 -->
    <div class="w-64 bg-white overflow-y-auto">
      <div class="flex items-center justify-between mb-4 pt-3 px-4">
        <h4 class="">添加组织</h4>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click.stop="openDialog('新增', { name: '' })"
        >
          添加分组
        </el-button>
      </div>
      <div
        v-for="(menu, menuIdx) in menuItems"
        :key="menuIdx"
        class="flex items-center justify-between py-3 px-4 border-0 border-b border-solid border-gray-100 cursor-pointer text-sm hover:bg-blue-50"
        :class="{ 'bg-blue-50 text-blue-500': currentMenu === menuIdx }"
        @click="handleChangeMenu(menuIdx)"
      >
        <span>{{ menu.name }}</span>
        <el-switch
          v-model="menu.status"
          inline-prompt
          :active-value="0"
          :inactive-value="1"
          v-if="menuIdx > 0"
          @change="handleChangeStatus(menu)"
        />
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="flex-1 ml-5">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="序号" width="60">
          <template #default="{ row, $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="字段名称">
          <template #default="{ row }">
            <div v-if="isFirstMenu">
              {{ row.name }}
            </div>
            <div v-else>
              <el-input v-model="row.name" placeholder="请输入" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="字段类型">
          <template #default="{ row }">
            <div v-if="isFirstMenu">
              {{ orgFileTypeList[row.type - 1].label }}
            </div>
            <div v-else>
              <el-select v-model="row.type" placeholder="请选择">
                <el-option
                  v-for="item in orgFileTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orgTypeId" label="使用组织类型">
          <template #default="{ row }">
            <div v-if="isFirstMenu">所有</div>
            <div v-else>
             <el-cascader
              v-model="row.orgTypeId"
              :props="defaultProps"
              :options="natureList"
              collapse-tags
              clearable
              filterable
              @change="handleChangeOrgType(row)"
            />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="启/禁用">
          <template #default="{ row }">
            <div v-if="isFirstMenu">{{ row.status === STATUS_ORG_FIELD_ON ? '启用' :'禁用' }}</div>
            <div v-else>
              <el-switch
                v-model="row.status"
                inline-prompt
                :active-value="STATUS_ORG_FIELD_ON"
                :inactive-value="STATUS_ORG_FIELD_OFF"
                active-text="启用"
                inactive-text="禁用"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="edit" label="修改权限">
          <template #default="{ row }">
            <div v-if="isFirstMenu">{{ row.edit === EDIT_ORG_FIELD_OFF ? '否' :'是' }}
            </div>
            <div v-else>
              <el-select v-model="row.edit">
                <el-option
                  v-for="item in editOrgFieldList"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option
                >">
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="queryScope" label="查看权限">
          <template #default="{ row }">
            <div v-if="isFirstMenu">所有</div>
            <div v-else>
              <el-cascader
                v-model="row.queryScope"
                :options="natureList"
                :props="defaultProps"
                collapse-tags
                clearable
                filterable
              @change="handleChangeOrgType(row,'queryScope')"
              >
              </el-cascader>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="字段注释（选填）">
          <template #default="{ row }">
            <div v-if="isFirstMenu">
              {{ row.remark }}
            </div>
            <div v-else>
              <el-input v-model="row.remark" placeholder="请输入" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4">
        <el-button
          type="danger"
          class="mt-4"
          :icon="useRenderIcon(AddFill)"
          @click="handleAddField"
          v-if="!isFirstMenu"
          >添加行</el-button
        >
      </div>

      <div class="mt-10 text-center">
        <el-button type="primary" class="w-[300px]!" @click="handleSubmit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
