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

/** 获取-分类管理-组织标签 */
export const getUserOrgApprove = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/user-org-approve/page"),
    { data }
  );
};

// system/user-org-approve/approve
export const approveUser = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/user-org-approve/approve"),
    {
      data
    }
  );
};



export const getOrgApproveList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-approve/page"),
    { data }
  );
};

// system/user-org-approve/detail

export const getOrgApproveDetail = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-approve/detail"),
    { data }
  );
};

// system/org-approve/approved
export const approveOrg = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-approve/approved"),
    { data }
  );
};