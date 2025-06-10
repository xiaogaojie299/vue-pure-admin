import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "请输入icon名称", trigger: "change" }],
  coverUrl: [{ required: true, message: "请选择icon图标", trigger: "change" }],
  type: [{ required: true, message: "请选择所属板块", trigger: "change" }],
});
