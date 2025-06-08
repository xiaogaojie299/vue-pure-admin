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

/** 获取组织列表-分页查询 */
export const getOrgPage = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("system/org/page"), {
    data
  });
};

/** 获取组织列表-获取当前用户所属组织列表 */
export const getAllOrg = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("system/org/get-all-org"), {
    data
  });
};
export const  getGroupFiled = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("/system/org/get-group-filed"),
    {
      data
    }
  );
};