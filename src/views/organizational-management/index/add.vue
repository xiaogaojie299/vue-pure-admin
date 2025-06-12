<script setup lang="tsx">
import { defineOptions, ref, onMounted, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import OrganizationForm from "./components/OrganizationForm.vue"
import ScrollAnchorNav from './components/ScrollAnchorNav.vue';
import DynamicForm from "./components/DynamicForm.vue";

import Refresh from "~icons/ep/refresh";
import EpQuestionFilled from "~icons/ep/question-filled";

import { getOrgFieldGroup, getGroupFiled } from "@/api/system";
import { addOrg, getOrgDetail, editOrg } from "@/api/organizational-management";

import {
  convertArrayToString,
  convertStringToArray,
  convertStringToArrayOrItemStr,
  deepFlattenAndFilter
} from "@/utils/common";
import { message } from "@/utils/message";
import { handleTree } from "@pureadmin/utils";

defineOptions({
  name: "OrganizationalManagementAdd"
});

const groupList = ref([]);

const router = useRouter();
const route = useRoute();

const id = computed(() => route.query.id || undefined);

const getGroupChildField = (parentId) => {
  return new Promise(resolve => { 
    getGroupFiled({
      parentId: parentId || 1
    }).then(res => {
      let list = res.data;
      list = list.map(item => {
          item.orgTypeId = convertStringToArrayOrItemStr(item.orgTypeId);
          item.queryScope = convertStringToArrayOrItemStr(item.queryScope);
        return item;
      });
      resolve(list)
    });
  })
};

const componentRefs = ref([]);

const setComponentRef = (el, index) => {
  componentRefs.value[index] = el;
};

const handleSave = async  () => {
  let key = 'dataFileRequests';

  let formRefs = componentRefs.value;

  console.log("onValidate", formRefs[0].onValidate())
  let validate = await formRefs[0].onValidate();
  console.log("validate", validate)
  if (!validate) {
    return;
  }
  let organizationFormData = formRefs[0]?.getFormData();

  const formDataList = formRefs
  .map((form, index) => (index > 0 ? form?.getFormData() : null))
  .filter(Boolean); // 过滤掉 null 和 index <= 0 的项

  organizationFormData[key] = deepFlattenAndFilter([
    organizationFormData[key],
    formDataList
  ]);
  let fnApi = !id.value ? addOrg : editOrg
  fnApi({...organizationFormData, id: !id.value ? undefined: Number(id.value)}).then(resp => {
    message('添加成功', {type: 'success'});
  })
  onBack()
}
const onBack = () => {
  router.go(-1)
}
const initGroupData = () => {
  getOrgFieldGroup().then(async (res) => {
    // 这里把状态正常的显示出来
    // let list = res.data?.filter(v => {
    //   v.status == 0;
    // });
    let list = res.data;
    groupList.value = list.map( (item, index) => {
      return {
        ...item,
        title: item.name,
        nodeId: `#part${index + 1}`
      }
    })

    if (id?.value) return;

    for(let i = 0; i < groupList.value.length; i++) {
      let item = groupList.value[i];
      let responseData = await getGroupChildField(item.id);
      let list = responseData?.map(item => {
        return {
          ...item,
          fieldName: item.name,
          fieldParentId: item.parentId,
          fieldValue: item.value,
          fieldId: item.id,
        }
      });
      item['tableData'] = list;
    }
  });
}

const initGetOrgDetail = async () => {
  let responseData = await getOrgDetail({ id: id.value });
  console.log('responseData', responseData.data);
  console.log('groupList', groupList.value);
  let list = [...responseData.data, ...groupList.value];

  let treeData = handleTree(list, "id", "fieldParentId", "tableData");

  groupList.value = treeData;
}

const initData = async () => { 
  initGroupData();
  initGetOrgDetail();
};
onMounted(async () => {
  initData();
});
</script>
<template>
  <div>
    <!-- 页面内容 -->
    <ScrollAnchorNav
    :anchors="groupList"
    content-height="82vh"
    :section-style="{ background: 'rgba(0,0,0,0.03)' }"
  >

    <div v-for="(item, index)  in groupList" :key="item.id" :id="item.nodeId.substring(1)" class="mb-2">
      <el-card shadow="never">
        <template #header>
          <h3>{{ item.title }}</h3>
        </template>
        <template v-if="!index">
          <!-- <OrganizationForm :ref="(el) => setComponentRef(el, index)" :fields="item.tableData" ></OrganizationForm> -->
           <OrganizationForm :ref="(el) => setComponentRef(el, index)"  :fields="item.tableData"  :isEdit="!!id"></OrganizationForm>
           
        </template>
        <template v-else>
          <dynamic-form
            v-model="item.formData"
            :fields="item.tableData"
            :ref="(el) => setComponentRef(el, index)"
          />
        </template>
      </el-card>
    </div>
  </ScrollAnchorNav>
  <div class="text-center mt-5">
    <el-button type="primary" round class="w-[180px]!" @click="handleSave">保存</el-button>
    <el-button type="" round class="w-[180px]!" @click="onBack">返回</el-button>
  </div>
  </div>
</template>
