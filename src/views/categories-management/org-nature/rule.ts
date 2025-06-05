import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  parentId: [
    { required: true, message: "请选择父级组织", trigger: "change" }
  ],
  name: [{ required: true, message: "请输入组织性质名称", trigger: "change" }]
});
