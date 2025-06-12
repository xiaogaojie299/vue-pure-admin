import { http } from "@/utils/http";
import { baseUrlApi } from "@/utils/http/baseUrlApi";

type Result = {
  success: boolean;
  data?: Array<any>;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", "/user", { data });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("get", "/list-all-role");
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/list-role-ids", { data });
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("get", baseUrlApi("system/role/list"), {
    data
  });
};

export const addRole = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("system/role"), { data });
};
export const editRole = (data?: object) => {
  return http.request<ResultTable>(
    "put",
    baseUrlApi("system/role"),
    { data }
  );
};
export const deleteRole = (data?: object) => {
  return http.request<ResultTable>(
    "delete",
    baseUrlApi("system/role"),
    { data }
  );
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("post", "/menu", { data });
};

export const addMenu = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/system/emnu"), { data });
};

export const editMenu = (data?: object) => {
  return http.request<Result>("put", baseUrlApi("/system/emnu"), { data });
};

export const deletMenu = (data?: object) => {
  return http.request<Result>("put", baseUrlApi(`/system/menu/${data}`));
};

/** 获取系统管理-部门管理列表 */
// export const getDeptList = (data?: object) => {
//   return http.request<Result>("post", "/dept", { data });
// };

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/online-logs", { data });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/login-logs", { data });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/operation-logs", { data });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/system-logs", { data });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: object) => {
  return http.request<Result>("post", "/system-logs-detail", { data });
};


/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenu = (data?: object) => {
  return http.request<Result>("get", baseUrlApi("system/menu/treeselect"), {
    data
  });
};

export const getDeptList = (data?: object) => {
  return http.request<Result>("get", baseUrlApi("system/dept/list"), { data });
};

export const addDept = (data?: object) => {
  return http.request<Result>("post", baseUrlApi("/system/dept"), { data });
};

export const editDept = (data?: object) => {
  return http.request<Result>("put", baseUrlApi("/system/dept"), { data });
};

export const deleteDept = (data?: object) => {
  return http.request<Result>("delete", baseUrlApi(`system/dept/${data}`));
};

export const getBannerList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`system/region-banner/page`), {
    data
  });
};

export const addBanner = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi(`/system/region-banner/save`),
    { data }
  );
};

export const editBanner = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi(`/system/region-banner/edit`),
    { data }
  );
};
export const deleteBanner = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi(`/system/region-banner/delete`),
    { data }
  );
};

export const getIconList = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`system/icon/page`), {
    data
  });
};

export const addIcon = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`/system/icon/save`), {
    data
  });
};

export const editIcon = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`/system/icon/edit`), {
    data
  });
};
export const deleteIcon = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`/system/icon/delete`), {
    data
  });
};

export const getGreement = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`system/agreement/query`), {
    data
  });
};

export const saveGreement = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`system/agreement/save`), {
    data
  });
};
export const getOrgFieldGroup = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi(`system/org-field/get-group`),
    {
      data
    }
  );
};


export const saveOrgFieldGroup = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`system/org-field/save`), {
    data
  });
};


export const editOrgField = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`system/org-field/edit`), {
    data
  });
};

export const getOrgFieldGroupChild = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi(`system/org/get-child-filed`),
    {
      data
    }
  );
};

export const getGroupFiled = (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi(`system/org-field/get-group-filed`),
    {
      data
    }
  );
};

// 批量保存
export const saveOrgFields= (data?: object) => {
  return http.request<Result>(
    "post",
    baseUrlApi(`system/org-field/save`),
    {
      data
    }
  );
};

export const getUserInfo = () => {
  return http.request<Result>(
    "get",
    baseUrlApi(`system/user/getInfo`),
    {}
  );
}
export const getAllOrg = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org/get-all-org"),
    {
      data
    }
  );
};
