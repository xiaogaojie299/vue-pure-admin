import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { TOAST_TITLE_SUCCESS } from "@/constants";

import { getUserOrgApprove, approveUser } from "@/api/audit-pending-management";
import { addDialog, closeDialog } from "@/components/ReDialog";
import editForm from "./form.vue";

import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";

import { formRules } from "./rule";
import type { FormItemProps } from "./types";


export function useOrgTags(tableRef: Ref) {
  const filterParams = reactive({
    name: "",
    mobile: "",
    orgName: "",
    status: ''
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

  const statusMap = {
    0: {
      showLabel: "未处理",
      label: "待审核",
      reverseLable: "处理",
      value: 0
    },
    1: {
      showLabel: "已通过",
      label: "通过",
      reverseLable: "",
      value: 1
    },

    2: {
      showLabel: "未通过",
      label: "驳回",
      reverseLable: "",
      value: 1
    }
  }; 
  const columns: TableColumnList = [
    {
      label: "序号",
      prop: "id",
      minWidth: 60,
      formatter: (row, column, cellValue, index) => {
        return index + 1;
      }
    },
    {
      label: "真实姓名",
      prop: "name",
      minWidth: 100
    },
    {
      label: "职位",
      prop: "positionName",
      minWidth: 100
    },
    {
      label: "联系电话",
      prop: "mobile",
      minWidth: 100
    },
    {
      label: "申请组织",
      prop: "parkName",
      minWidth: 100
    },
    {
          label: "申请时间",
          prop: "createTime",
          minWidth: 180,
          formatter: ({ createTime }) =>
            dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
        },
    {
      label: "审核状态",
      prop: "status",
      slot: "status"
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
      width: 120
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    pagination.pageSize = val;
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    pagination.currentPage = val;

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
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    
    await deleteOrgTag({
      ids: getKeyList(curSelected, "id")
    })

    message(TOAST_TITLE_SUCCESS, { type: "success" });
    
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getUserOrgApprove(
      toRaw({ ...filterParams, ...pagination, pageNum: pagination.currentPage })
    ).finally(() => {
      loading.value = false;
    });
    dataList.value = data.records;
    pagination.total = data.total;
  }
  function openDialog(row: FormItemProps) {
    const isEdit = row.status === 0;
    addDialog({
      title: `处理`,
      props: {
        formInline: {
          name: row?.name ?? "",
          status: row?.status ?? "",
          roleId: row?.roleId ?? "",
          remark: row?.remark ?? "",
          id: row?.id ?? "",
          ...row
        },
        isEdit: isEdit
      },
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, { ref: formRef, formInline: null,  }),
      footerRenderer: ({ options, index }) => (
        <div class="text-center">
          <el-button
            type="primary"
            class="w-[80px]!"
            onClick={() => {
              console.log("哈哈哈哈", options.props.formInline);
              const FormRef = formRef.value.getRef();
              console.log("FormRef", FormRef);
              let curData = options.props.formInline;
              if (!curData.status) {
                message("请选择审核状态", {
                  type: "error"
                });
                return;
              }
              approveUser({
                id: curData?.id,
                status: curData.status,
                roleId: curData.roleId,
                remark: curData.remark
              }).then(() => {
                closeDialog(options, index);
                onSearch();
              });
            }}
          >
            确定
          </el-button>
          <el-button
            class="w-[80px]!"
            onClick={() => closeDialog(options, index)}
          >
            取消
          </el-button>
        </div>
      )
    });
  }

  async function handleDelete(row: any) {
    await deleteOrgTag([row.id]);
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
    //   onSearch();

    //   })
    //   .catch(() => {});
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
    statusMap,
    loading,
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
    handleDelete
  };
}
