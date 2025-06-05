import dayjs from "dayjs";
import { message } from "@/utils/message";
import {  ElMessageBox } from "element-plus";
import { handleTree } from "@/utils/tree";

import { addDialog } from "@/components/ReDialog";
import editForm from "./form.vue";
import { TOAST_TITLE_SUCCESS } from "@/constants";


import {
  addRegion,
  editRegion,
  getRegion,
  deleteRegion
} from "@/api/region-management";

import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";

import { formRules } from "./rule";
import type { FormItemProps } from "./types";


export function useRegion(tableRef: Ref) {
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  async function onSearch() {
    loading.value = true;
  }

  function formatName(data, key='name') {
    const originalFields = ["country", "province", "market", "area", "street"];
    data.forEach((item) => {
      originalFields.forEach((field) => {
        if (item[field]) {
          item[key] = item[field];
        }
      });
    });
    return data
  }
  // 异步加载树形数据
  const loadTreeData = async () => {
    loading.value = true;
    try {
      let { data } = await getRegion();
      data = formatName(data);
      let treeList = handleTree(data);
      dataList.value = treeList || [];
      console.log("treeList", treeList);
      // const response = await axios.get('/api/industry-category') // 替换为你的接口地址
      // dataList.value = response.data || []
    } catch (error) {
      message("加载产业类型失败");
      console.error("Failed to load industry categories:", error);
    }
  };
  function openDialog(title = "新增", row: any, type = "add") {
    let titlelevelMap = {
      1: "一级区域",
      2: "二级区域",
      3: "三级区域",
      4: "四级区域",
      5: "五级区域",
    };

    // 提取上级信息
    const parentNames = [];

    // 如果是子节点，获取所有上级节点名称
    let current = row;
    while (current && current.level > 1) {
      const parent = findParentNode(dataList.value, current.parentId);
      if (parent) {
        parentNames.unshift(parent.name); // 往数组头部插入
        current = parent;
      } else {
        break;
      }
    }
    // 构造表单初始值
    const formInlineData =
      type === "edit"
        ? {
            ...row,
            parentNames: parentNames // [制造业, 汽车制造]
          }
        : {
            parentId: row?.id || 0,
            level: row.level + 1,
            parentNames: parentNames // [制造业, 汽车制造]
          };
    
    const apiFn = type === "edit" ? editRegion : addRegion;

    addDialog({
      title: `${title}${titlelevelMap[type === "edit" ? row.level : row.level + 1]}`,
      props: {
        formInline: formInlineData
      },
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(TOAST_TITLE_SUCCESS, {
            type: "success"
          });
          done(); // 关闭弹框
          loadTreeData(); // 刷新表格数据
        }

        FormRef.validate(async valid => {
          if (valid) {
            await apiFn({
              ...curData
            });
            chores();
          }
        });
      }
    });
  }

  // 查找父节点的工具函数
  function findParentNode(nodes, parentId) {
    for (const node of nodes) {
      if (node.id === parentId) {
        return node;
      }
      if (node.children) {
        const result = findParentNode(node.children, parentId);
        if (result) return result;
      }
    }
    return null;
  }

  async function handleDelete(row: any) {
        await deleteRegion([row.id]);
        message(TOAST_TITLE_SUCCESS, { type: "success" });
        loadTreeData();
    // ElMessageBox.confirm("是否确认删除此类型?", "提示", {
    //   confirmButtonText: "确认",
    //   cancelButtonText: "关闭",
    //   type: "warning"
    // })
    //   .then(() => {
    //     message({
    //       type: "success",
    //       message: "删除成功"
    //     });
    //     onSearch();
    //   })
    //   .catch(() => {});
  }

  // 行点击事件
  const handleRowClick = (row: any) => {
    console.log("Row clicked:", row);
  };

  // 添加子节点
  const handleAddChild = (row: any) => {
    console.log("Add child to:", row);
  };

  // 编辑节点
  const handleEdit = (row: any) => {
    console.log("Edit:", row);
    // 实现编辑逻辑
  };

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    // onSearch();
    loadTreeData();
  });

  return {
    loading,
    dataList,
    onSearch,
    loadTreeData,
    resetForm,
    openDialog,
    handleDelete,
    handleRowClick,
    handleEdit
  };
}
