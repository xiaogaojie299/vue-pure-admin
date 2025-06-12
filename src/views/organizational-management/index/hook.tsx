import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getKeyList } from "@pureadmin/utils";
import { TOAST_TITLE_SUCCESS } from "@/constants";

import {
  getOrgPage,
  deleteOrg
} from "@/api/organizational-management";
import type { PaginationProps } from "@pureadmin/table";
import { type Ref, reactive, ref, onMounted, toRaw, computed, watch } from "vue";
import { useRouter } from "vue-router";

import { useTreeCascader } from "@/views/region-management/treeCascaderHook";

const {  handleCascaderChange } = useTreeCascader();
export function useOrganManagement(tableRef: Ref) {
  const form = reactive({
      region: [],
      name: "",
      natureId: "",
      orgIndustryId: "",
      orgTypeId: ""
  });
  const router = useRouter();
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
      minWidth: 90,
      formatter: (row, column, cellValue, index) => {
        return index + 1;
      },
    },
    {
      label: "组织名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "创新积分",
      prop: "score",
      minWidth: 90
    },
    {
      label: "组织规模",
      prop: "peopleNum",
      minWidth: 120,
      formatter: ({ peopleNum }) => {
        return peopleNum + "人";
      }
    },
    {
      label: "组织性质",
      prop: "natureId"
    },
    {
      label: "注册基金",
      prop: "natureId",
      formatter: item => "-"
    },
    {
      label: "所在园区",
      prop: "parkIds"
    },
    {
      label: "添加时间",
      prop: "createTime",
      minWidth: 180,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      slot: "handle",
      width: 250,
      fixed: "right",
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

  /** 当CheckBox选择项发生变化时会触发该事件 */
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
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    await deleteOrg({
      ids: getKeyList(curSelected, "id")
    })

    message(TOAST_TITLE_SUCCESS, { type: "success" });
      
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  /** 清空日志 */
  function clearAll() {
    // 根据实际业务，调用接口删除所有日志数据
    message("已删除所有日志数据", {
      type: "success"
    });
    onSearch();
  }


  async function onSearch() {

    let regionForm = handleCascaderChange(form.region);
    const { data } = await getOrgPage(
      toRaw({
        ...form,
        ...regionForm,
        pageSize: pagination.pageSize,
        pageNum: pagination.currentPage
      })
    );
    dataList.value = data.records;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
      onSearch();
  };

  const handleDelete = async (row) => {
        await deleteOrg([row.id]);
        message(TOAST_TITLE_SUCCESS, { type: "success" });
        onSearch();
  }

  const handleGoAdd = () => {
    router.push({
      name: "OrganizationalManagementAdd"
    });
  };

  const handleGoEdit = (row) => {
    router.push({
      path: "/organizational-structure/add",
      query: {
        id: row.id
      }
    });
  }

  const handleGoDetails = (row) => {
    router.push({
      name: "OrganizationalManagementDetails",
      query: {
        id: row.id
      }
    });
  }

  const handleGoEditLog = (row) => {
    router.push({
      name: "OrganizationalManagementEditLog",
      query: {
        id: row.id
      }
    });
  }
  
  onMounted(() => {
    // onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    selectedNum,
    onSearch,
    clearAll,
    resetForm,
    onbatchDel,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange,
    handleGoAdd,
    handleGoEdit,
    handleDelete,
    handleGoDetails,
    handleGoEditLog
  };
}
