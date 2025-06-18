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

export const getUsrtTouristList = (data?: object) => {
  return http.request<ResultTable>(
    "post",
    baseUrlApi("system/user/tourist-list"),
    { data }
  );
};
export const editUserTourist = (data?: object) => {
  return http.request<ResultTable>(
    "put",
    baseUrlApi("system/user"),
    {
      data
    }
  );
};

