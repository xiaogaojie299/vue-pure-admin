import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { TOAST_TITLE_SUCCESS } from "@/constants";
import { useRegion } from "../index/hook";

import {
  addPark,
  getPark,
  editPark,
  getParkList,
  getParkDetail,
  deleteRegion
} from "@/api/region-management";
import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";

import { useRouter } from "vue-router";
import { deleteOrgTag } from "@/api/categories-management";

export function usePark(tableRef?: Ref) {
  const { treeData, loadTreeData } = useRegion();

  const router = useRouter();
  const filterParams = reactive({
    name: "",
    region: ""
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
      showLabel: "展示",
      label: "正常",
      reverseLable: "隐藏",
      value: 0
    },
    1: {
      showLabel: "隐藏",
      label: "隐藏",
      reverseLable: "展示",
      value: 1
    }
  };
  const levelFieldMap = [
    "countryId",
    "provinceId",
    "marketId",
    "areaId",
    "streetId"
  ] as const;

  const selectedOptions = ref<any[]>([]);
  const formInline = reactive({
    countryId: undefined,
    provinceId: undefined,
    marketId: undefined,
    areaId: undefined,
    streetId: undefined
  });

  const columns: TableColumnList = [
    // {
    //   label: "勾选列", // 如果需要表格多选，此处label必须设置
    //   type: "selection",
    //   fixed: "left",
    //   reserveSelection: true // 数据刷新后保留选项
    // },
    {
      label: "序号",
      prop: "id",
      minWidth: 60
    },
    {
      label: "园区名称",
      prop: "name",
      width: 200
    },

    {
      label: "所有权人",
      prop: "name",
      minWidth: 60
    },
    {
      label: "管理员",
      prop: "name",
      minWidth: 60
    },
    {
      label: "所属区域",
      prop: "regionRelationName"
    },

    {
      label: "详细地址",
      prop: ""
    },
    {
      label: "楼栋数量",
      prop: "buildingNum"
    },
    {
      label: "状态",
      prop: "status",
      slot: "status"
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];



function handleCascaderChange(value: any[]) {
  // 清空所有字段
  Object.keys(formInline).forEach(key => {
    formInline[key] = undefined;
  });

  value.forEach((item, index) => {
    if (index < levelFieldMap.length) {
      const field = levelFieldMap[index];
      formInline[field] = item;
    }

    // if (index === value.length - 1) {
    //   const field = levelFieldMap[index];
    //   formInline[field] = item;
    // }
  });
}
  
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

    await deleteRegion({
      ids: getKeyList(curSelected, "id")
    });

    message(TOAST_TITLE_SUCCESS, { type: "success" });

    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  function goEditDetail(id) {
    router.push({
      path: `/region-management/edit-park-detail`,
      query: {
        id: id
      }
    });
  }
  async function onSearch() {
    loading.value = true;
    const { data } = await getPark(
      toRaw({
        name: filterParams.name,
        ...pagination,
        pageNum: pagination.currentPage,
        ...formInline
      })
    ).finally(() => {
      loading.value = false;
    });
    dataList.value = data.records;
    pagination.total = data.total;
  }
  function openDialog(title = "新增", row: FormItemProps) {
    
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
    // 清空所有字段
    Object.keys(formInline).forEach(key => {
      formInline[key] = undefined;
    });

    onSearch();
  };

   const handleChangeStatus = async (row) => {
    await editPark({
      id: row.id,
      status: !row.status ? 1 : 0
    });
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    filterParams,
    loading,
    columns,
    dataList,
    statusMap,
    pagination,
    selectedNum,
    treeData,
    onSearch,
    resetForm,
    onSelectionCancel,
    goEditDetail,
    loadTreeData,
    openDialog,
    onbatchDel,
    handleCascaderChange,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleDelete,
    handleChangeStatus,
  };
}
