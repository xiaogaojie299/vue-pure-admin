import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { TOAST_TITLE_SUCCESS } from "@/constants";

import {
  addBanner,
  getBannerList,
  editBanner,
  deleteBanner
} from "@/api/system";

import {
  getPark,
} from "@/api/region-management";

import { addDialog, closeDialog } from "@/components/ReDialog";
import editForm from "./form.vue";

import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";

import { formRules } from "./rule";
import type { FormItemProps } from "./types";
export function useBanner(tableRef: Ref) {
  const filterParams = reactive({
    name: "",
    status: undefined
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
      label: "banner名称",
      prop: "name",
      minWidth: 100
    },
    {
      label: "园区",
      prop: "regionIdName",
      minWidth: 100
    },
    {
      label: "排序",
      prop: "sortNum",
      minWidth: 100
    },
    {
      label: "图片",
      prop: "coverUrl",
      minWidth: 100,
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.coverUrl}
          preview-src-list={Array.of(row.avatar)}
          class="w-[150px] h-[50px] rounded align-middle"
        />
      )
    },

    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      slot: "status"
    },
    {
      label: "跳转类型",
      prop: "type",
      minWidth: 100,
      slot: "type"
    },
    {
      label: "跳转板块",
      prop: "redirectContent",
      minWidth: 100
    },
    {
      label: "开始时间-结束时间",
      prop: "redirectContent",
      formatter: ({ startTime, endTime }) =>
        dayjs(startTime).format("YYYY-MM-DD HH:mm:ss") +
        "-" +
        dayjs(endTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
      width: 200
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
    
    await deleteBanner({
      ids: getKeyList(curSelected, "id")
    })

    message(TOAST_TITLE_SUCCESS, { type: "success" });
    
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getBannerList(toRaw({ ...filterParams, ...pagination, pageNum: pagination.currentPage })).finally(() => {
      loading.value = false;
    });
    dataList.value = data.records;
    pagination.total = data.total;
  }
  function openDialog(title = "新增", row: FormItemProps) {
    const isWatch = ref(title === "预览");
    addDialog({
      title: `${title}banner`,
      props: {
        formInline: {
          name: row?.name ?? "",
          /*
          times: "",
          startTime: "",
          endTime: "",
          status: "",
          type: "",
          coverUrl: "", // 图片
          redirectContent: '', // 跳转内容
          redirectType: '', // 跳转类型
          sortNum: "",    // 排序
          regionId: ""
        */
          ...row
        }
      },
      width: "70%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, { ref: formRef, formInline: null, isWatch }),
      footerRenderer: ({ options, index }) => (
        <div class="text-center">
          <el-button
            type="primary"
            round
            class="w-[180px]!"
            onClick={() => {
              
              // 如果点击了编辑按钮
              if (isWatch.value) {
                isWatch.value = false;
                return;
              }

              const FormRef = formRef.value.getRef();
              const curData = options.props.formInline as FormItemProps;
              function chores() {
                message(TOAST_TITLE_SUCCESS, {
                  type: "success"
                });
                closeDialog(options, index);
                onSearch(); // 刷新表格数据
              }
              FormRef.validate(async valid => {
                if (valid) {
                  // 表单规则校验通过
                  let apiFn = title === "新增" ? addBanner : editBanner;
                  let params = { ...curData };
                  params["regionName"] = formRef.value.getRegionName();

                  await apiFn({ ...params, id: row?.id ?? undefined }).then(
                    () => {
                      if (title === "新增") {
                        pagination.currentPage = 1;
                      }
                      chores();
                    }
                  );
                }
              });
            }}
          >
            { isWatch.value ? '编辑' : '保存' }
          </el-button>
          <el-button
            type=""
            class="w-[180px]!"
            round
            onClick={() => closeDialog(options, index)}
          >
            取消
          </el-button>
        </div>
      )
    });
  }

     const handleChangeStatus = async (row) => {
      await editBanner({
        id: row.id,
        status: !row.status ? 1 : 0
      });
      onSearch();
    };
  async function handleDelete(row: any) {
    await deleteBanner([row.id]);
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
    handleChangeStatus,
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
