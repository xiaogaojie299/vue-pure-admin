import dayjs from "dayjs";
import { message } from "@/utils/message";
import { TOAST_TITLE_SUCCESS } from "@/constants";

import { getOrgApproveList } from "@/api/audit-pending-management";

import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import { useRouter } from "vue-router";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";

export function useOrgTags(tableRef: Ref) {
  const router = useRouter();

  const filterParams = reactive({
    authName: "",
    mobile: "",
    orgName: "",
  });
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
      label: "组织名称",
      prop: "orgName",
      minWidth: 100
    },
    {
      label: "唯一信用社码",
      prop: "idCard",
      minWidth: 100
    },
    {
      label: "法人",
      prop: "legalName",
      minWidth: 100
    },
    {
      label: "注册资本",
      prop: "capital",
      minWidth: 100
    },
    {
      label: "提交人",
      prop: "createUser",
      minWidth: 100
    },
    {
      label: "提交人电话",
      prop: "",
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
      label: "成立时间",
      prop: "orgCreateTime",
      minWidth: 180,
      formatter: ({ orgCreateTime }) =>
        dayjs(orgCreateTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "审核状态",
      prop: "status",
      slot: "status",
      minWidth: 100
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

  function handleGoOrgAudit(row) {
    router.push({
      name: "AuditPendingManagementOrgDetail",
      query: {
        id: row.id
      }
    });
  }
  async function onSearch() {
    loading.value = true;
    const { data } = await getOrgApproveList(
      toRaw({ ...filterParams, ...pagination, pageNum: pagination.currentPage })
    ).finally(() => {
      loading.value = false;
    });
    dataList.value = data.records;
    pagination.total = data.total;
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
    handleGoOrgAudit,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
  };
}
