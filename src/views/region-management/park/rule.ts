import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [
    {
      required: true,
      message: "园区名称不能为空",
      trigger: "blur"
    },
    {
      min: 2,
      max: 50,
      message: "名称长度在2到50个字符之间",
      trigger: "blur"
    }
  ],
  regionRelation: [
    {
      required: true,
      message: "请选择所属区域",
      trigger: "change"
    }
  ],
  logo: [
    {
      required: true,
      message: "请上传logo",
      trigger: "change"
    }
  ],
  coverUrl: [
    {
      required: true,
      message: "请上传封面图",
      trigger: "change"
    }
  ],
  backUrl: [
    {
      required: true,
      message: "请上传背景图",
      trigger: "change"
    }
  ],
  address: [
    {
      required: true,
      message: "详细地址不能为空",
      trigger: "blur"
    },
    {
      min: 5,
      max: 100,
      message: "地址长度在5到100个字符之间",
      trigger: "blur"
    }
  ],
  longitude: [
    {
      required: true,
      message: "经度不能为空",
      trigger: "change"
    }
  ]
});
