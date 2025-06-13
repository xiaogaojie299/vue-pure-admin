<script setup lang="tsx">
import { defineOptions, ref, onMounted, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import ScrollAnchorNav from './components/ScrollAnchorNav.vue';


import { getOrgFieldGroup, getGroupFiled } from "@/api/system";
import {  getOrgDetail, getOrgLogDetail } from "@/api/organizational-management";

import {
  convertStringToArrayOrItemStr,
  deepFlattenAndFilter
} from "@/utils/common";
import { message } from "@/utils/message";
import { handleTree } from "@pureadmin/utils";
import { tableData } from "@/views/welcome/data";

defineOptions({
  name: "OrganizationalManagementEditLog"
});

const groupList = ref([]);

const router = useRouter();
const route = useRoute();

const id = computed(() => route.query.id || undefined);

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
    initGetOrgDetail();
  });
}

const initGetOrgDetail = async () => {
  let responseData = await getOrgLogDetail({ id: id.value });
  let dataFileRequests = responseData.data?.filter(v => !!v.fieldName);

  dataFileRequests = dataFileRequests?.map(v => {
    try {
      v.fieldJson = JSON.parse(v.fieldJson);
    } catch (error) {
      v.fieldJson = {
        label: [],
        value: []
      }
    }
      return v
    })

    console.log("dataFileRequests", dataFileRequests);

  let list = [...dataFileRequests, ...groupList.value];

  let treeData = handleTree(list, "id", "fieldParentId", "tableData");
    console.log('treeData', treeData);
  groupList.value = treeData;
}

const initData = async () => { 
  initGroupData();
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
        <template v-if="item['tableData'] && item['tableData'].length > 0">
        <el-descriptions title="" border  :column="1" label-width="180px">
          <el-descriptions-item v-for="info in item['tableData']" :label="info.fieldName" :key="info.id" :label-class-name="info.edit && 'isActive'">
            <el-descriptions title=""  :column="2" >
                  <el-descriptions-item label="" class-name="custom-class" label-class-name="custom-label-class" width="200">
                    <template v-if="info.fieldJson?.label?.length">
                      <el-space>
                          <div v-for="(label, index) in info.fieldJson.label" :key="index">
                            {{ ['服务区域'].includes(info.fieldName) ?  label?.join('-') : label }}
                          </div>
                      </el-space>
                    </template>
                    <template v-else>
                      <template v-if="['营业执照', '公司logo'].includes(info.fieldName)">
                        <el-image
                          fit="cover"
                          preview-teleported
                          :src="info.fieldValue"
                          :preview-src-list="Array.of(info.fieldValue)"
                          class="w-[150px] h-[50px] rounded align-middle"
                        />
                      </template>
                      <template v-else>
                          <el-space>
                              <div>
                                {{ info.fieldValue  }}
                              </div>
                          </el-space>
                      </template>
                    </template>
                  </el-descriptions-item>
                  
                  <el-descriptions-item label="" class-name="cus" label-class-name="custom-label-class" width="200">
                    <template v-if="info.fieldJson?.label?.length">
                      <el-space>
                          <div v-for="(label, index) in info.fieldJson.label" :key="index">
                            {{ ['服务区域'].includes(info.fieldName) ?  label?.join('-') : label }}
                          </div>
                      </el-space>
                    </template>
                    <template v-else>
                      <template v-if="['营业执照', '公司logo'].includes(info.fieldName)">
                        <el-image
                          fit="cover"
                          preview-teleported
                          :src="info.fieldValue"
                          :preview-src-list="Array.of(info.fieldValue)"
                          class="w-[150px] h-[50px] rounded align-middle"
                        />
                      </template>

                      <template v-else>
                          <el-space>
                              <div :class="{'text-red-500': info.edit}">
                                {{ info.fieldNewValue  }}
                              </div>
                          </el-space>
                      </template>
                    </template>
                  </el-descriptions-item>
                </el-descriptions>
          </el-descriptions-item>
        </el-descriptions>
        </template>
        <template v-else>
          <el-empty description="暂无数据"></el-empty>
        </template>
      </el-card>
    </div>
  </ScrollAnchorNav>
  <div class="text-center mt-5">
    <el-button type="" round class="w-[180px]!" @click="router.go(-1)">返回</el-button>
  </div>
  </div>
</template>
<style lang="scss" scoped> 
::v-deep {

  .custom-label-class {
    // display: none !important;
  }
  .custom-class {
  }
  .isActive {
    background: var(--el-color-danger-light-5) !important;
  }
}

</style>