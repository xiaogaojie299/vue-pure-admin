import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  country: [{ required: true, message: "请输入国家名称", trigger: "change" }],
  province: [{ required: true, message: "请输入省份", trigger: "change" }],
  market: [{ required: true, message: "请输入市", trigger: "change" }],
  area: [{ required: true, message: "请输入区县", trigger: "change" }],
  street: [{ required: true, message: "请输入街道", trigger: "change" }],
  logo: [{ required: true, message: "请上传logo", trigger: "change" }],
  contactName: [
    { required: true, message: "请输入联系人名称", trigger: "change" }
  ],
  // 联系人手机号 正则校验
  contactMobile: [
    {
      required: true,
      message: "请输入联系人手机号",
      trigger: "change"
    },
    {
      // 手机号正则
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur"
    }
  ]
});
