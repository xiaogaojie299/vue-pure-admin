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

/** 获取-区域管理-园区管理 */
export const getPark = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/park/page"),
    { data }
  );
};

/** 添加-区域管理-园区管理 */
export const addPark = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/park/add"),
    { data }
  );
};


/** 添加-区域管理-园区管理 */
export const getParkDetail = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("system/park/detail"), {
    data
  });
};

// /system/park/edit

/** 编辑-区域管理-园区管理 */
export const editPark = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/park/edit"),
    { data }
  );
};

/** 根据街道id查询园区 */ 
export const getParkList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/park/get-park-list"),
    { data }
  );
};