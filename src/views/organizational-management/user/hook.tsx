import dayjs from "dayjs";
import roleForm from "../role.vue";
import editForm from "../index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import userAvatar from "@/assets/user.jpg";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReviewUserInfo from "./components/ReviewUserInfo.vue";
import {
  formatRegionValues,
} from "@/utils/common";
import { useTree } from "@/views/region-management/treeHook";
const { treeData, loadTreeData } = useTree();

import type { FormItemProps, RoleFormItemProps } from "./types";
import {
  getKeyList,
  isAllEmpty,
  hideTextAtIndex,
  deviceDetection
} from "@pureadmin/utils";
import {
  getRoleIds,
  getDeptList,
  getRoleList
} from "@/api/system";


import { editUser, getUserList, getUserInfo } from "@/api/user";

import {
  ElMessageBox
} from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {

  const optionsBasis = ref(["全部", "正常", "停用"]);

  const currentValue = ref("全部");
  
  const form = reactive({
    region: "",
    userName: "",
    phone: "",
    status: ""
  });
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const switchLoadMap = ref({});
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "排序",
      prop: "id",
      width: 90,
      slot: "sort"
    },
    {
      label: "用户头像",
      prop: "avatarUrl",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.avatar || userAvatar}
          preview-src-list={Array.of(row.avatar || userAvatar)}
          class="w-[24px] h-[24px] rounded-full align-middle"
        />
      ),
      width: 90
    },
    {
      label: "用户昵称",
      prop: "nickName",
      minWidth: 130
    },
    {
      label: "真实姓名",
      prop: "userName",
      minWidth: 130
    },
    {
      label: "性别",
      prop: "sex",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.sex == "1" ? "danger" : null}
          effect="plain"
        >
          {row.sex == "1" ? "女" : "男"}
        </el-tag>
      )
    },
    {
      label: "手机号码",
      prop: "phonenumber",
      minWidth: 160
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={"0"}
          inactive-value={"1"}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          disabled
        />
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "h-[20px]!",
      "reset-margin",
      "text-gray-500!",
      "dark:text-white!",
      "dark:hover:text-primary!"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);

  const handleChangeAreaCasder = async (values: []) => {
    let filterParams = formatRegionValues(values);
  };

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    message(`您删除了用户编号为${row.id}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  async function onSearch() {
      loading.value = true;
      const { rows, total } = await getUserList(
        toRaw({ ...form, ...pagination, pageNum: pagination.currentPage })
      ).finally(() => {
        loading.value = false;
      });
      dataList.value = rows;
      pagination.total = total;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.deptId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.deptId = selected ? id : "";
    console.log("id", id, selected);
    onSearch();
  }

  const handleChangeStatus = (row) => {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status == 0 ? "停用" : "启用"
      }吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    ).then(resp => {
      editUser({
        userId: row.userId,
        status: row.status == 0 ? 1 : 0
      }).then(resp => {
        onSearch();
        message(`操作成功`, {
          type: "success"
        });
      })
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );
  function handleReview (row) {
    addDialog({
      width: "60%",
      draggable: true,
      props: {
        ...row
      },
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: () => <ReviewUserInfo row={row}></ReviewUserInfo>
    });
  }

  onMounted(async () => {
    loadTreeData();
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    selectedNum,
    pagination,
    buttonClass,
    optionsBasis,
    currentValue,
    deviceDetection,
    onSearch,
    resetForm,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleChangeStatus,
    handleChangeAreaCasder,
    handleReview
  };
}
