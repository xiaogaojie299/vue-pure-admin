import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  username: [
    { required: true, message: "请输入组织性质名称", trigger: "change" }
  ]
});
