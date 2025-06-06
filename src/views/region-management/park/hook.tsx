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
  getParkDetail
} from "@/api/region-management";
import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";

import { useRouter } from "vue-router";

export function usePark(tableRef?: Ref) {
  const { treeData, loadTreeData } = useRegion();

  const router = useRouter();
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
      prop: "status"
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
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
    });

    message(TOAST_TITLE_SUCCESS, { type: "success" });

    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  function goEditDetail() {
    router.push({
      path: "/region-management/edit-park-detail"
    });
  }
  /**
   * 获取选中节点的 label 路径
   * @param data 树形数据源
   * @param selectedIds 选中的 id 列表
   * @returns string[]
   */
  function getSelectedLabels(data, selectedIds) {
    const result = [];

    function findLabelById(data, id) {
      for (const node of data) {
        if (node.id === id) {
          return node.name;
        }
        if (node.children) {
          const found = findLabelById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    }

    for (const id of selectedIds) {
      const label = findLabelById(data, id);
      if (label) result.push(label);
    }

    return result;
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getPark(
      toRaw({ ...filterParams, ...pagination, pageNum: pagination.currentPage })
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
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleDelete,
    getSelectedLabels
  };
}
