<script setup lang="tsx">
import { ref, h, onMounted, computed, nextTick, defineEmits, watch } from "vue";
// https://plus-pro-components.com/components/search.html
import "plus-pro-components/es/components/search/style/css";
import { type PlusColumn, PlusSearch } from "plus-pro-components";

import {
  getOrgNature,
  getOrgIndustry,
  getOrgType
} from "@/api/categories-management";

import { useOrganManagement } from "../hook";
import { useTree } from "@/views/region-management/treeHook";
import { useTreeCascader } from "@/views/region-management/treeCascaderHook";
import { getPark } from "@/api/region-management";

const { treeData, loadTreeData } = useTree();
const { form, onSearch } = useOrganManagement();

// const emits = defineEmits(["onSearch", "onReset"]);

const allTemplate = ref({
  label: "全部",
  value: ""
});
const newForm = ref(form);

  watch(
    () => form,
    (value) => {
      newForm.value = value;
    },
    { deep: true, immediate: true }
  );

// 组织性质
const orgNatureList = ref([allTemplate.value]);

// 产业类型
const orgIndustryList = ref([allTemplate.value]);

// 组织类型
const orgTypeList = ref([allTemplate.value]);

// 园区
const parkOptions = ref<any[]>([]);


const getOrgNatureList = async () => {
  let { data } = await getOrgNature({ pageSize: 1000, pageNum: 1 });

  let list = data.records || [];
  const newList = list?.map(item => {
    return {
      ...item,
      value: item.id,
      label: item.name
    };
  });
  orgNatureList.value = [...orgNatureList.value, ...newList];
};
//
const getOrgIndustryList = async () => {
  let { data } = await getOrgIndustry({ pageSize: 1000, pageNum: 1 });

  let list = data || [];
  const newList = list?.map(item => {
    return {
      ...item,
      value: item.id,
      label: item.name
    };
  });
  orgIndustryList.value = [...orgIndustryList.value, ...newList];
};

const getOrgTypeList = async () => {
  let { data } = await getOrgType({ pageSize: 1000, pageNum: 1 });

  let list = data.records || [];

  const newList = list?.map(item => {
    return {
      ...item,
      value: item.id,
      label: item.name
    };
  });
  orgTypeList.value = [...orgTypeList.value, ...newList];
};


const getParkOptions = () => {
  getPark({
    pageNum: 1,
    pageSize: 1000
  }).then(res => {
    let list= res.data.records;
    parkOptions.value = list.map(v => {
      return {
        ...v,
        value: v.id,
        label: v.name
      };
    });
  });
};
const initData = async () => {
  // 获取组织信息
  getOrgNatureList();
  // 产业类型
  getOrgIndustryList();
  // 组织分类
  getOrgTypeList();
  // 组织园区
  getParkOptions();
};

onMounted(() => {
  nextTick(() => {
    loadTreeData();
  });
});

initData();

const columns: PlusColumn[] = [
  {
    label: "区域选择",
    prop: "region",
    valueType: "cascader",
    options: computed(() => treeData.value),
    fieldProps: {
      placeholder: "全部区域",
      props: {
        checkStrictly: true, // 允许选择任意一级
        emitPath: true, // 只返回当前选中的值
        label: "name",
        value: "id"
      },
      clearable: true,
      filterable: true
    },

    colProps: {
      span: 16
    }
  },
  {
    label: "园区选择",
    prop: "parkId",
    valueType: "select",
    options: computed(() => parkOptions.value),
    fieldProps: {
      placeholder: "全部园区",
      value: "id",
      clearable: true,
      filterable: true
    },

    colProps: {
      span: 8
    }
  },
  {
    label: "组织名称",
    prop: "name",
    valueType: "copy",
    colProps: {
      span: 6
    }
  },
  {
    label: "组织性质",
    prop: "natureId",
    valueType: "select",
    options: computed(() => orgNatureList.value),
    fieldProps: {
      placeholder: "全部",
    },
    colProps: {
      span: 6
    }
  },
  {
    label: "产业类型",
    prop: "orgIndustryId",
    valueType: "select",
    options: computed(() => orgIndustryList.value),
    fieldProps: {
      placeholder: "全部",
    },
    colProps: {
      span: 6
    }
  },
  {
    label: "组织分类",
    prop: "orgTypeId",
    valueType: "select",
    fieldProps: {
      placeholder: "全部",
    },
    options: computed(() => orgTypeList.value),
    colProps: {
      span: 6
    }
  }
];

const handleChange = (values: any) => {
};
const handleSearch = (values: any) => {
  onSearch();
};
const handleRest = () => {
  console.log("handleRest");
  // emits("onReset");
};
</script>

<template>
  <PlusSearch
    v-model="form"
    :columns="columns"
    :show-number="4"
    label-width="120"
    label-position="right"
    @change="handleChange"
    @search="handleSearch"
    @reset="handleRest"
  >
  </PlusSearch>
</template>
