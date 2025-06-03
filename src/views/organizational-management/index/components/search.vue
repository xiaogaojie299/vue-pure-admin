<script setup lang="tsx">
import { ref, h } from "vue";
// https://plus-pro-components.com/components/search.html
import "plus-pro-components/es/components/search/style/css";
import { type PlusColumn, PlusSearch } from "plus-pro-components";

const state = ref({
  status: "0",
  time: new Date().toString()
});

const columns: PlusColumn[] = [
  {
    label: "区域选择",
    prop: "title",
    fieldProps: {
      // 优先级低于 renderField 的props
      placeholder: "请输入"
    },
    colProps: {
      span: 2
    },
    renderField: (_, onChange) => {
      return h(<div></div>, {
        // 返回VNode时，需要手动调用 renderField 的onChange 回调把值传给表单
      });
    }
  },
  {
    label: "省份",
    prop: "shengfen",
    valueType: "cascader",
    options: [
      {
        value: "0",
        label: "陕西",
        children: []
      },
      {
        value: "1",
        label: "山西"
      }
    ],
    colProps: {
      span: 4
    }
  },
  {
    label: "省份",
    prop: "chengshi",
    valueType: "cascader",
    options: [
      {
        value: "0",
        label: "陕西",
        children: []
      },
      {
        value: "1",
        label: "山西"
      }
    ],
    colProps: {
      span: 4
    }
  },
  {
    label: "区县",
    prop: "quxian",
    valueType: "cascader",
    options: [
      {
        value: "0",
        label: "陕西",
        children: []
      },
      {
        value: "1",
        label: "山西"
      }
    ],
    colProps: {
      span: 4
    }
  },
  {
    label: "街道",
    prop: "jiedao",
    valueType: "cascader",
    options: [
      {
        value: "0",
        label: "陕西",
        children: []
      },
      {
        value: "1",
        label: "山西"
      }
    ],
    colProps: {
      span: 4
    }
  },
  {
    label: "园区",
    prop: "yuanqu",
    valueType: "cascader",
    options: [
      {
        value: "0",
        label: "陕西",
        children: []
      },
      {
        value: "1",
        label: "山西"
      }
    ],
    colProps: {
      span: 4
    }
  },
  {
    label: "组织名称",
    prop: "zuzhimincheng",
    valueType: "copy"
  },
  {
    label: "组织性质",
    prop: "zuzhixingzhi",
    valueType: "select",
    options: [
      {
        label: "未解决",
        value: "0",
        color: "red"
      },
      {
        label: "已解决",
        value: "1",
        color: "blue"
      },
      {
        label: "解决中",
        value: "2",
        color: "yellow"
      },
      {
        label: "失败",
        value: "3",
        color: "red"
      }
    ]
  },
  {
    label: "产业类型",
    prop: "chanyeleixin",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: "0"
      },
      {
        label: "互联网",
        value: "1"
      },
      {
        label: "金融",
        value: "2"
      },
      {
        label: "教育",
        value: "3"
      },
      {
        label: "医疗",
        value: "4"
      }
    ]
  },
  {
    label: "组织分类",
    prop: "zuzhifenlei",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: "0"
      },
      {
        label: "互联网",
        value: "1"
      },
      {
        label: "金融",
        value: "2"
      },
      {
        label: "教育",
        value: "3"
      },
      {
        label: "医疗",
        value: "4"
      }
    ]
  }
];

const handleChange = (values: any) => {
  console.log(values, "change");
};
const handleSearch = (values: any) => {
  console.log(values, "search");
};
const handleRest = () => {
  console.log("handleRest");
};
</script>

<template>
  <PlusSearch
    v-model="state"
    :columns="columns"
    :show-number="4"
    label-width="120"
    label-position="right"
    @change="handleChange"
    @search="handleSearch"
    @reset="handleRest"
  />
</template>
