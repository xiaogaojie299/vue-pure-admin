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

/** 添加-区域管理-区域管理 */
export const addRegion = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("system/region/add"), {
    data
  });
};

/** 删除-区域管理-区域管理 */
export const deleteRegion = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/region/delete"),
    { data }
  );
};

/** 修改-区域管理-区域管理 */
export const editRegion = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/region/edit"),
    { data }
  );
};

/** 获取-区域管理-区域管理 */
export const getRegion = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/region/list"),
    { data }
  );
};