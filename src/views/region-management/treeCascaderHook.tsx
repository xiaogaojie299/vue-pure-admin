
import { message } from "@/utils/message";
import { type Ref, reactive, ref, onMounted, toRaw, h } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList } from "@pureadmin/utils";

import { useRouter } from "vue-router";
import { deleteOrgTag } from "@/api/categories-management";

export function useTreeCascader() {
  const levelFieldMap = [
    "countryId",
    "provinceId",
    "marketId",
    "areaId",
    "streetId"
  ] as const;

  const formInline = reactive({
    countryId: '',
    provinceId: '',
    marketId: '',
    areaId: '',
    streetId: ''
  });

  function handleCascaderChange(value: any[]) {
    // 清空所有字段

    value?.forEach((item, index) => {
      if (index < levelFieldMap.length) {
        const field = levelFieldMap[index];
        formInline[field] = item;
      }

      // if (index === value.length - 1) {
      //   const field = levelFieldMap[index];
      //   formInline[field] = item;
      // }
    });

    return formInline
  } 

  function handlClearFormInline() {
    // 清空所有字段
    Object.keys(formInline).forEach(key => {
      formInline[key] = '';
    });
  }

  return {
    formInline,
    handlClearFormInline,
    handleCascaderChange,
  };
}
