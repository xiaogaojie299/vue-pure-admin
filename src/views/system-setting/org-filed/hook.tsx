import { onMounted, ref, h, computed } from "vue";

import {
  getOrgFieldGroup,
  saveOrgFieldGroup,
  editOrgField,
  getGroupFiled
} from "@/api/system.ts";
import { getOrgNatureTree } from "@/api/categories-management";

import { generateMockData } from "../constants";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { TOAST_TITLE_SUCCESS } from "@/constants";

import type { FormItemProps } from "./types";

import form from "./form.vue"
import { ElMessageBox } from "element-plus";
export function useOrgFilde() {

  const menuItems = ref([
  ]);
  const formRef = ref(null);
  const currentMenu = ref(0);
  const tableData = ref([
  ]);
  const natureList = ref([]);

  const isFirstMenu = computed(() => currentMenu.value === 0);
  const getMenuList = () => {
    getOrgFieldGroup().then(res => {
      menuItems.value = res.data;
    });
  }


const getNatureList = async () => {
  const { data } = await getOrgNatureTree({
    pageSize: 1000,
    pageNum: 1
  });
  natureList.value = data;
  console.log('树形结构', natureList.value);
};
  
  const getGroupChildField = () => {
    getGroupFiled({
      parentId: menuItems.value[currentMenu.value]?.id || 1
    }).then(res => {
      tableData.value = res.data;
    });
  };
  const handleChangeMenu = (index) => {
    if (index === currentMenu.value) return;
    currentMenu.value = index;
    getGroupChildField();
  };

  const handleblurOfRemark = (row) => {
    if (currentMenu.value === 0) {
      editOrgField({
        ...row
      }).then(() => {
        message(TOAST_TITLE_SUCCESS, {
          type: "success"
        });
      });
    }
  };

  const handleAddField = () => { 
    tableData.value.push(generateMockData());
  };
  

  const handleSubmit = () => {
    ElMessageBox.confirm("保存后新增字段的字段类型将不可修改，请仔细核对?", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "关闭",
      type: "warning"
    })
      .then(() => {
        console.log("保存的list", tableData.value);
      })
      .catch(() => {});
  }

  const onSearch = () => {
    getMenuList();
    getGroupChildField();
  };
  
  function openDialog(title = "新增", row) {
    addDialog({
      title: `${title}分组`,
      props: {
        formInline: {
          name: row?.name ?? "",
          parentId: row.parentId ?? 0
        }
      },
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(form, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(TOAST_TITLE_SUCCESS, {
            type: "success"
          });
          done(); // 关闭弹框
          getMenuList(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过  原型上没有编辑，先留着可能之后会加
            let apiFn = title === "新增" ? saveOrgFieldGroup : editOrgField;
            await apiFn({ ...curData }).then(() => {
              chores();
            });
          }
        });
      }
    });
  }
  const handleChangeStatus = async (row) => {
       console.log("handleChangeStatus", row);
      await editOrgField({
        id: row.id,
        status: row.status
      });
      getMenuList();
  };
  
  const initData = () => {
    onSearch();
    getNatureList();  // 获取组织性质
  }
  onMounted(() => {
    onSearch();
    initData();
  });

  
  
  return {
    tableData,
    menuItems,
    currentMenu,
    isFirstMenu,
    natureList,
    openDialog,
    handleChangeStatus,
    handleChangeMenu,
    handleblurOfRemark,
    handleAddField,
    handleSubmit
  };
}