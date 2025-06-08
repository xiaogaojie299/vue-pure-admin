import dayjs from "dayjs";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { getDeptList, editDept, addDept, deleteDept } from "@/api/system";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form/dept.vue";
import { TOAST_TITLE_SUCCESS } from "@/constants";


import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";

export function useDept() {
  const form = reactive({
    name: "",
    status: null,
    parentId: undefined
  });

  const formRef = ref();
  const dataList = ref([]);
  const { tagStyle } = usePublicHooks();
  const higherDeptOptions = ref();

  const treeData = ref([]);
  const treeLoading = ref(true);

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    initData()
  }

  function onAdd(data) {  
    form.parentId = data.id;
  }
  
  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", _row?) {
    let row = _row?.data ?? {};
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          higherDeptOptions: formatHigherDeptOptions(cloneDeep(treeData.value)),
          parentId: row?.parentId ?? 0,
          deptName: row?.deptName ?? "",
          principal: row?.principal ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          sort: row?.sort ?? 0,
          status: row?.status ?? 1,
          remark: row?.remark ?? "",

          deptId: row?.deptId ?? undefined,
          orderNum: 1,
          type: 1 // 类型1内部部门（管理平台只有内部部门） 2外部组织
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`${TOAST_TITLE_SUCCESS}`, {
            type: "success"
          });
          initData();
          done(); // 关闭弹框
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);

            let apiFn = title === "新增" ? addDept : editDept;
            let params = { ...curData };
            apiFn(params).then(resp => {
              chores();
            });
          }
        });
      }
    });
  }

  function handleDelete(id) {
    console.log("deleteDept", deleteDept);
    deleteDept(id).then(() => {
      message(TOAST_TITLE_SUCCESS, { type: "success" });
      onSearch();
    });
  }
  const  initData = async () => {
    // 归属部门
    const { data } = await getDeptList();

    higherDeptOptions.value = handleTree( cloneDeep(data), "deptId");

    treeData.value = handleTree(cloneDeep(data), "deptId");
    treeLoading.value = false;
  }
  onMounted(async () => {
    initData()
  });

  return {
    form,
    treeData,
    treeLoading,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改部门 */
    openDialog,
    /** 删除部门 */
    handleDelete,
    handleSelectionChange
  };
}
