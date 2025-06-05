import dayjs from "dayjs";
import { message } from "@/utils/message";
import {  ElMessageBox } from "element-plus";

import { addDialog } from "@/components/ReDialog";
import editForm from "./form.vue";

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

  // 异步加载树形数据
  const loadTreeData = async () => {
    try {
      let responseData = [
        {
          id: 1,
          name: "制造业",
          leavel: 1,
          children: [
            { id: 2, name: "汽车制造", leavel: 2 },
            { id: 3, name: "电子设备制造", leavel: 2 }
          ]
        },
        {
          id: 4,
          name: "服务业",
          leavel: 1,
          children: [
            { id: 5, name: "软件服务", leavel: 2 },
            { id: 6, name: "物流服务", leavel: 2 }
          ]
        }
      ];
      setTimeout(() => {
        dataList.value = responseData || [];
      }, 1000);
      // const response = await axios.get('/api/industry-category') // 替换为你的接口地址
      // dataList.value = response.data || []
    } catch (error) {
      message("加载产业类型失败");
      console.error("Failed to load industry categories:", error);
    }
  };
  function openDialog(title = "新增", row: any) {
    let titleLeavelMap = {
      1: "一级分类",
      2: "二级分类"
    };
    addDialog({
      title: `${title}${titleLeavelMap[row.leavel + 1]}`,
      props: {
        formInline: {
          username: row?.username ?? ""
        }
      },
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了角色名称为${curData.username}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  function handleDelete(row: any) {
    ElMessageBox.confirm("是否确认删除部门?", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "关闭",
      type: "warning"
    })
      .then(() => {
        message({
          type: "success",
          message: "删除成功"
        });
        onSearch();
      })
      .catch(() => {});
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
