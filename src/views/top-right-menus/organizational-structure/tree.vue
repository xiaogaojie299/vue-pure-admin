<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, computed, watch, getCurrentInstance, h } from "vue";
import { addDialog } from "@/components/ReDialog";
import { useDept } from "./utils/deptHook.tsx";

import Dept from "~icons/ri/git-branch-line";

import { ElMessage, ElMessageBox } from "element-plus";

// import Reset from "~icons/ri/restart-line";
import More2Fill from "~icons/ri/more-2-fill?width=18&height=18";
import OfficeBuilding from "~icons/ep/office-building";
import LocationCompany from "~icons/ep/add-location";
import ExpandIcon from "./svg/expand.svg?component";
import UnExpandIcon from "./svg/unexpand.svg?component";
import AddFill from "~icons/ri/add-circle-line";
import RiEditCircleFill from "~icons/ri/edit-circle-fill";
import EpCircleCloseFilled from "~icons/ep/circle-close-filled";

import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";

const { treeData, treeLoading, onSearch, resetForm, openDialog } = useDept();

interface Tree {
  id: number;
  name: string;
  highlight?: boolean;
  children?: Tree[];
}

const emit = defineEmits(["tree-select"]);
const formRef = ref();

const treeRef = ref();
const isExpand = ref(true);
const searchValue = ref("");
const highlightMap = ref({});
const { proxy } = getCurrentInstance();
const defaultProps = {
  children: "children",
  label: "name"
};
const buttonClass = computed(() => {
  return [
    "h-[20px]!",
    "text-sm!",
    "reset-margin",
    "text-(--el-text-color-regular)!",
    "dark:text-white!",
    "dark:hover:text-primary!"
  ];
});

function formatHigherDeptOptions(treeList) {
  // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
  if (!treeList || !treeList.length) return;
  const newTreeList = [];
  for (let i = 0; i < treeList.length; i++) {
    treeList[i].disabled = treeList[i].status === 0 ? true : false;
    formatHigherDeptOptions(treeList[i].children);
    newTreeList.push(treeList[i]);
  }
  return newTreeList;
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

function nodeClick(value) {
  const nodeId = value.$treeNodeId;
  highlightMap.value[nodeId] = highlightMap.value[nodeId]?.highlight
    ? Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: false
      })
    : Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: true
      });
  Object.values(highlightMap.value).forEach((v: Tree) => {
    if (v.id !== nodeId) {
      v.highlight = false;
    }
  });
  emit(
    "tree-select",
    highlightMap.value[nodeId]?.highlight
      ? Object.assign({ ...value, selected: true })
      : Object.assign({ ...value, selected: false })
  );
}

function toggleRowExpansionAll(status) {
  isExpand.value = status;
  const nodes = (proxy.$refs["treeRef"] as any).store._getAllNodes();
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

/** 重置部门树状态（选中状态、搜索框值、树初始化） */
function onTreeReset() {
  highlightMap.value = {};
  searchValue.value = "";
  toggleRowExpansionAll(true);
}

const onEditDept = node => {
  openDialog("修改", node);
};

const onAddDept = () => {
  openDialog("新增");
};

const onDeleteDept = (node, data) => {
  ElMessageBox.confirm("是否确认删除部门?", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "关闭",
    type: "warning"
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除成功"
      });
    })
    .catch(() => {});
};

watch(searchValue, val => {
  treeRef.value!.filter(val);
});

defineExpose({ onTreeReset });
</script>

<template>
  <div
    v-loading="treeLoading"
    class="h-full bg-bg_color overflow-hidden relative"
    :style="{ minHeight: `calc(100vh - 141px)` }"
  >
    <div>
      <div class="flex justify-between items-center px-2 py-2">
        <h4>部门</h4>
        <el-button
          type="primary"
          @click="openDialog('新增')"
          link
          :icon="useRenderIcon(AddFill)"
        >
          添加部门
        </el-button>
      </div>
      <div class="flex items-center h-[34px]">
        <el-input
          v-model="searchValue"
          class="ml-2"
          size="small"
          placeholder="请输入部门名称"
          clearable
        >
          <template #suffix>
            <el-icon class="el-input__icon">
              <IconifyIconOffline
                v-show="searchValue.length === 0"
                icon="ri/search-line"
              />
            </el-icon>
          </template>
        </el-input>
        <el-dropdown :hide-on-click="false">
          <More2Fill class="w-[28px] cursor-pointer outline-hidden" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-button
                  :class="buttonClass"
                  link
                  type="primary"
                  :icon="useRenderIcon(isExpand ? ExpandIcon : UnExpandIcon)"
                  @click="toggleRowExpansionAll(isExpand ? false : true)"
                >
                  {{ isExpand ? "折叠全部" : "展开全部" }}
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-divider />
    <el-scrollbar height="calc(90vh - 128px)">
      <el-tree
        ref="treeRef"
        :data="treeData"
        node-key="id"
        size="small"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
      >
        <template #default="{ node, data }">
          <div
            :class="[
              'rounded-sm',
              'flex',
              'items-center',
              'justify-between',
              'select-none',
              'hover:text-primary',
              'w-full',
              searchValue.trim().length > 0 &&
                node.label.includes(searchValue) &&
                'text-red-500',
              highlightMap[node.id]?.highlight ? 'dark:text-primary' : ''
            ]"
            :style="{
              color: highlightMap[node.id]?.highlight
                ? 'var(--el-color-primary)'
                : '',
              background: highlightMap[node.id]?.highlight
                ? 'var(--el-color-primary-light-7)'
                : 'transparent'
            }"
          >
            <span class="truncate!" :title="node.label">
              {{ node.label }}
            </span>
            <div>
              <el-button
                type="primary"
                link
                :icon="useRenderIcon(RiEditCircleFill)"
                @click.stop="onEditDept(node)"
              ></el-button>

              <el-button
                type="primary"
                link
                :icon="useRenderIcon(AddFill)"
                @click.stop="onAddDept"
                size="large"
              ></el-button>
              <el-button
                type="danger"
                size="large"
                link
                @click.stop="onDeleteDept(node)"
                :icon="useRenderIcon(EpCircleCloseFilled)"
              ></el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: transparent;
}
</style>
