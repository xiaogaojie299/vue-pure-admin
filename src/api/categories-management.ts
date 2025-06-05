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

/** 添加-分类管理-组织标签 */
export const addOrgTag = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-label/add"),
    { data }
  );
};


/** 获取-分类管理-组织标签 */
export const getOrgTag = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-label/page"),
    { data }
  );
};



/** 编辑-分类管理-组织标签 */
export const setOrgTag = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-label/edit"),
    { data }
  );
};

/** 删除-分类管理-组织标签 */
export const deleteOrgTag = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-label/delete"),
    { data }
  );
};





/** 添加-分类管理-组织分类 */
export const addOrgType = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi("system/org-type/add"), {
    data
  });
};


/** 获取-分类管理-组织分类 */
export const getOrgType = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-type/page"),
    { data }
  );
};



/** 编辑-分类管理-组织分类 */
export const setOrgType = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-type/edit"),
    { data }
  );
};

/** 删除-分类管理-组织分类 */
export const deleteOrgType = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-type/delete"),
    { data }
  );
};


/** 添加-分类管理-组织性质 */
export const addOrgNature = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-nature/add"),
    { data }
  );
};

/** 获取-分类管理-组织性质 */
export const getOrgNature = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-nature/page"),
    { data }
  );
};

/** 修改-分类管理-组织性质 */
export const updateOrgNature = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-nature/edit"),
    { data }
  );
};

/** 删除-分类管理-组织性质 */
export const deleteOrgNature = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-nature/delete"),
    { data }
  );
};

/** 添加-分类管理-产业类型 */
// /system/org-industry/add
export const addOrgIndustry = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-industry/add"),
    { data }
  );
};

/** 编辑-分类管理-产业类型 */
export const editOrgIndustry = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-industry/edit"),
    { data }
  );
};

/** 删除-分类管理-产业类型 */
export const delOrgIndustry = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-industry/delete"),
    { data }
  );
};
/** 获取-分类管理-产业类型 */
export const getOrgIndustry = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/org-industry/list"),
    { data }
  );
};