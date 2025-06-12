import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

export const bannerStatusMap = {
  0: {
    showLabel: "上架",
    label: "上架",
    reverseLable: "下架",
    value: 0
  },

  1: {
    showLabel: "下架",
    label: "下架",
    reverseLable: "上架",
    value: 1
  }
};

export const bannerTypeMap = {
  0: {
    label: "无跳转",
    showLabel: "无跳转",
    value: 0
  },
  1: {
    label: "内部跳转",
    showLabel: "内部跳转",
    value: 1
  }
};
export const bannerRedirectTypeMap = {
  1: {
    label: "资讯板块",
    showLabel: "资讯板块",
    value: 1
  },
  2: {
    label: "资讯详情",
    showLabel: "资讯详情",
    value: 2
  },
  3: {
    label: "空间详情",
    showLabel: "空间详情",
    value: 3
  },
  4: {
    label: "服务详情",
    showLabel: "服务详情",
    value: 4
  }
};

export const iconTypeMap = {
  1: {
    label: "公共服务",
    showLabel: "公共服务",
    value: 1
  },
  2: {
    label: "空间服务",
    showLabel: "空间服务",
    value: 2
  },
  3: {
    label: "科技服务",
    showLabel: "科技服务",
    value: 3
  }
};

export const iconJumpType = {
  1: {
    label: "资讯列表",
    showLabel: "资讯列表",
    value: 1
  },
  2: {
    label: "服务列表",
    showLabel: "服务列表",
    value: 2
  },
  3: {
    label: "产品列表",
    showLabel: "产品列表",
    value: 3
  },
  4: {
    label: "咨询详情",
    showLabel: "咨询详情",
    value: 4
  },
  5: {
    label: "服务详情",
    showLabel: "服务详情",
    value: 5
  },

  6: {
    label: "产品详情",
    showLabel: "产品详情",
    value: 6
  },
  7: {
    label: "空间详情",
    showLabel: "空间详情",
    value: 7
  },
  8: {
    label: "功能说明",
    showLabel: "功能说明",
    value: 8
  }
};

export const agreementType = [
  {
    label: "用户类型",
    showLabel: "用户协议",
    value: 1,
    content: ""
  },
  {
    label: "隐私协议",
    showLabel: "隐私协议",
    value: 2,
    content: ""
  },

  {
    label: "购买协议",
    showLabel: "购买协议",
    value: 3,
    content: ""
  },

  {
    label: "信息真实性确认书",
    showLabel: "信息真实性确认书",
    value: 4,
    content: ""
  }
];

export const EDIT_ORG_FIELD_OFF = 0;
export const EDIT_ORG_FIELD_ON = 1;

export const editOrgFieldList = [
  //0否 1是
  {
    label: "否",
    showLabel: "否",
    value: EDIT_ORG_FIELD_OFF
  },
  {
    label: "是",
    showLabel: "是",
    value: EDIT_ORG_FIELD_ON
  }
];

export const STATUS_ORG_FIELD_OFF = 1;
export const STATUS_ORG_FIELD_ON = 0;

export const orgFieldTypeStatus = [
  // 0正常 1禁用
  {
    label: "否",
    showLabel: "否",
    value: STATUS_ORG_FIELD_OFF
  },
  {
    label: "是",
    showLabel: "是",
    value: STATUS_ORG_FIELD_ON
  }
];

export const orgFileTypeList = [
  {
    label: "文本",
    value: 1
  },
  {
    label: "图片",
    value: 2
  },
  {
    label: "选择",
    value: 3
  },
  {
    label: "富文本",
    value: 4
  },
  {
    label: "数字",
    value: 5
  },
  {
    label: "日期",
    value: 6
  }
];
// Mock Data
export const generateMockData = () => {
    return {
      id: 0,
      name: "",
      type: 1,
      orgTypeId: "",
      status: 0,
      edit: 1,
      queryScope: "",
      remark: ""
    }
};
