import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { TOAST_TITLE_SUCCESS } from "@/constants";

import {
  addOrgNature,
  getOrgNature,
  updateOrgNature,
  deleteOrgNature
} from "@/api/categories-management";

import { addDialog } from "@/components/ReDialog";
import editForm from "./form.vue";

import { type Ref, reactive, ref, onMounted, toRaw, h, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";

import { formRules } from "./rule";
import type { FormItemProps } from "./types";

export function useOrgNature(tableRef: Ref) {
  const route = useRoute();
  const router = useRouter();

  const natureId = computed(() => {
    if (route.query?.id) {
      return Number(route.query?.id);
    } 
    return 0
  });
  const natureName = computed(() => route.query.name);

  const filterParams = reactive({
    name: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "序号",
      prop: "id",
      minWidth: 60
    },

    {
      label: "组织性质名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "下级性质树",
      prop: "nextCount",
      minWidth: 60
    },
    {
      label: "添加时间",
      prop: "createTime",
      minWidth: 120,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }
  
  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  async function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    await deleteOrgNature({
      ids: getKeyList(curSelected, "id")
    })
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
      loading.value = true;
      const { data } = await getOrgNature(
        toRaw({
          ...filterParams,
          pageNum: pagination.currentPage,
          pageSize: pagination.pageSize,
          parentId: natureId.value
        })
      ).finally(() => {
        loading.value = false;
      });
    dataList.value = data?.records || [];
    console.log("dataList.value", dataList.value);
      pagination.total = data?.total || 0;
  }
  function openDialog(title = "添加", row?:FormItemProps) {
    addDialog({
      title: `${title}组织性质`,
      props: {
        formInline: {
          ...row,
          parentId: natureId.value || 0
        },
      },
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            let apiFn = !!row?.id ? updateOrgNature : addOrgNature;

            await apiFn({
              ...curData,
            }).then(() => {
              if (!row?.id) {
                pagination.currentPage = 1;
              }
              chores();
            });
          }
        });
      }
    });
  }

  async function handleDelete(row: any) {
      await deleteOrgNature([row.id]);
          message(TOAST_TITLE_SUCCESS, { type: "success" });
      onSearch();
    
    // ElMessageBox.confirm("是否确认删除部门?", "提示", {
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

  function handleGoPageOrgSubNature(row) {
    router.push({
      name: "CategoriesManagementOrgSubNature",
      query: {
        id: row.id,
        name: row.name
      }
    });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    filterParams,
    loading,
    natureName,
    columns,
    dataList,
    pagination,
    selectedNum,
    onSearch,
    resetForm,
    onSelectionCancel,
    openDialog,
    onbatchDel,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleDelete,
    handleGoPageOrgSubNature
  };
}
