<template>
  <div>
    <el-form label-width="180" :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="统一信用社会码" prop="code">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[0]?.remark">
              <el-tooltip :content="fields[0]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">统一社会信用代码:</span>
          </div>
        </template>
        <el-input
          v-model="form.code"
          placeholder="请输入"
          clearable
          class="w-[150px]! mr-2"
        />
        <el-button type="primary">查询</el-button>
      </el-form-item>

      <!-- 组织名称 -->
      <el-form-item label="组织名称" prop="name">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[1]?.remark">
              <el-tooltip :content="fields[1]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">组织名称:</span>
          </div>
        </template>
        <el-input v-model="form.name" placeholder="请输入" clearable></el-input>
      </el-form-item>

      <!-- 营业执照 -->
      <el-form-item label="营业执照:">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[2]?.remark">
              <el-tooltip :content="fields[2]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">营业执照:</span>
          </div>
        </template>
        <ReUploadImage
          v-model="form.businessLicense"
          :multiple="false"
          :limit="1"
        />
      </el-form-item>

      <!-- 所在园区 -->
      <el-form-item label="所在园区：" prop="inPark">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[3]?.inPark">
              <el-tooltip :content="fields[3]?.inPark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">所在园区:</span>
          </div>
        </template>
        <el-select v-model="form.inPark" placeholder="请选择" 
            multiple
            filterable>
          <el-option
            v-for="item in parkOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 数据级别 -->
      <el-form-item label="数据级别:" prop="dataLevel">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[4]?.remark">
              <el-tooltip :content="fields[4]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">数据级别:</span>
          </div>
        </template>
        <el-radio-group v-model="form.dataLevel">
          <el-radio label="普通组织" value="1">普通组织</el-radio>
          <el-radio label="管理组织" value="2">管理组织</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 管理范围 -->
      <el-form-item
        label="管理范围："
        prop="managementScope"
        v-if="form.dataLevel === '2'"
      >
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[5]?.remark">
              <el-tooltip :content="fields[5]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">管理范围:</span>
          </div>
        </template>
        <el-row :gutter="20" class="w-full flex items-center">
          {{ form.managementScope }}
          <el-cascader
            v-model="form.managementScope"
            :options="treeData"
            :props="{
              checkStrictly: true, // 允许选择任意一级
              emitPath: true, // 只返回当前选中的值
              label: 'name',
              value: 'id'
            }"
            @change="handlChangeRegion"
            placeholder="请选择区域"
            filterable
            class="w-[180px]!"
          />
          <el-select
            :disabled="!form.managementScope"
            class="w-[180px]! ml-4"
            v-model="managementScopePark"
            placeholder="园区"
          >
            <el-option
              filterable
              v-for="item in managementScopeParkList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-row>
      </el-form-item>
      <!-- 高新企业 -->
      <el-form-item label="高新企业:" prop="highTech">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[5]?.remark">
              <el-tooltip :content="fields[5]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">高新企业:</span>
          </div>
        </template>
        <el-radio-group v-model="form.highTech">
          <el-radio label="是">是</el-radio>
          <el-radio label="否">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 组织性质 -->
      <el-form-item label="组织性质:" prop="organizationNature">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[7]?.remark">
              <el-tooltip :content="fields[7]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">组织性质:</span>
          </div>
        </template>
        <el-cascader
          v-model="form.organizationNature"
          :props="{
            multiple: false,
            label: 'name',
            value: 'id',
            children: 'children'
          }"
          :options="natureList"
          collapse-tags
          clearable
          filterable
        />
      </el-form-item>

      <!-- 组织分类 -->
      <el-form-item label="组织分类:" prop="organizationCategory">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[8]?.remark">
              <el-tooltip :content="fields[8]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">组织分类:</span>
          </div>
        </template>
        <el-select v-model="form.organizationCategory" placeholder="请选择" 
            filterable
            multiple>
          <el-option
            v-for="item in orgTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 业务标签 -->
      <el-form-item label="业务标签:">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[9]?.remark">
              <el-tooltip :content="fields[9]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">业务标签:</span>
          </div>
        </template>
        <div>
          <el-button type="primary" @click="showOrgTagDialog = true"
            >去选择</el-button
          >
          <div>
            <el-tag
              v-for="item in form.businessTags"
              :key="item.id"
              class="tag-item"
              closable
              @close="removeTag(item)"
              >{{ item.name }}</el-tag
            >
          </div>
        </div>
      </el-form-item>

      <!-- 服务区域 -->
      <el-form-item label="服务区域:">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[10]?.remark">
              <el-tooltip :content="fields[10]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">服务区域:</span>
          </div>
        </template>
        <div>
          <!-- <el-button @click="showAreaDialog = true">选择服务</el-button> -->
          <div>
            <el-cascader
              v-model="selectServiceArea"
              :options="treeData"
              :props="{
                multiple: false,
                checkStrictly: true, // 允许选择任意一级
                emitPath: true, // 只返回当前选中的值
                label: 'name',
                value: 'id'
              }"
              placeholder="请选择区域"
              filterable
              class="w-[180px]!"
              @change="handleChangeAreaCasder"
            />

            <el-select
              :disabled="!selectServiceArea"
              class="w-[180px]! ml-4"
              v-model="selectServiceAreaPark"
                filterable
              placeholder="园区"
            >
              <el-option
                v-for="item in serviceAreaParkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button class="ml-3!" type="primary" plain @click="handleAddServiceArea">添加</el-button>
          </div>
          <div>
            <el-tag
              v-for="(item, index) in form.serviceArea"
              :key="item.id"
              class="tag-item"
              closable
              @close="removeServiceArea(index)"
              >{{ item.name?.join('-') }}</el-tag
            >
          </div>
        </div>
      </el-form-item>

      <!-- 产业类型 -->
      <el-form-item label="产业类型:">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[11]?.remark">
              <el-tooltip :content="fields[11]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">产业类型:</span>
          </div>
        </template>
        <el-cascader
          v-model="form.industryType"
          :options="orgIndustryOptions"
          :props="{
            checkStrictly: true, // 允许选择任意一级
            emitPath: true, // 只返回当前选中的值
            label: 'name',
            value: 'id'
          }"
          clearable
        ></el-cascader>
      </el-form-item>

      <!-- 公司logo -->
      <el-form-item label="公司logo:" prop="logo">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[12]?.remark">
              <el-tooltip :content="fields[12]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">公司logo:</span>
          </div>
        </template>
        <ReUploadImage v-model="form.logo" :multiple="false" :limit="1" />
      </el-form-item>

      <!-- 产业类型 -->
      <el-form-item label="公司简述:" prop="companyDescription">
        <template #label>
          <div class="flex items-center">
            <template v-if="fields[13]?.remark">
              <el-tooltip :content="fields[13]?.remark" placement="top">
                <EpQuestionFilled></EpQuestionFilled>
              </el-tooltip>
            </template>
            <span class="ml-1">公司简述:</span>
          </div>
        </template>
        <el-input
          type="textarea"
          v-model="form.companyDescription"
          placeholder="请输入"
          :rows="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="organizationIntroduction">
        <div class="custom-style">
          <el-segmented v-model="currentValue" :options="optionsBasis" />
        </div>
      </el-form-item>
      <template v-if="currentValue === '组织介绍'">
        <el-form-item label="" prop="organizationIntroduction">
          <template #label>
            <div class="flex items-center">
              <template v-if="fields[13]?.remark">
                <el-tooltip :content="fields[13]?.remark" placement="top">
                  <EpQuestionFilled></EpQuestionFilled>
                </el-tooltip>
              </template>
            </div>
          </template>
          <Editor v-model:value="form.organizationIntroduction"></Editor>
        </el-form-item>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="登录账号:" prop="loginAccount">
            <el-input
              v-model="form.loginAccount"
              placeholder="请输入"
              clearable
              class="w-[200]px!"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录密码:" prop="loginPassword">
            <el-input
              type="password"
              v-model="form.loginPassword"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="确认密码:" prop="confirmPassword">
            <el-input
              type="password"
              v-model="form.confirmPassword"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色:" prop="">
            <el-select v-model="form.roleId">
              <el-option
                v-for="item in roleOptions"
                :label="item.roleName"
                :value="item.roleId"
                :key="item.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ComponentSelectOrgTagDialog
      v-model:show="showOrgTagDialog"
      @onSelect="onSelectOrgTag"
    ></ComponentSelectOrgTagDialog>
    <el-dialog title="选择服务区域" v-model="showAreaDialog">
      <div>
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="treeData"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="{ label: 'name' }"
        />
        <el-button
          type="primary"
          class="w-[160px]! mt-3"
          round
          @click="onSelectArea"
          >确定</el-button
        >
        <el-button type="" class="w-[160px]!" round>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref, defineProps, onMounted, defineExpose, watch } from "vue";

import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Segmented, { type OptionsType } from "@/components/ReSegmented";

import Editor from "@/components/Editor.vue";
import ReUploadImage from "@/components/ReUploadImage/index.vue";
import ComponentSelectOrgTagDialog from "./SelectOrgTagDialog.vue";

import { useTree } from "@/views/region-management/treeHook";
import {
  formatRegionValues,
  uniqueByKey,
  getSelectedLabels,
  convertArrayToString
} from "@/utils/common";
import { handleTree } from "@/utils/tree";

import { getPark } from "@/api/region-management";
import {
  getOrgNatureTree,
  getOrgIndustry,
  getOrgType
} from "@/api/categories-management";
import { getRoleList } from "@/api/system";

import Refresh from "~icons/ep/refresh";
import EpQuestionFilled from "~icons/ep/question-filled";

const LABLE_WIDTH = "50px";
const props = defineProps({
  fields: {
    type: Array as PropType<OptionsType>,
    default: () => {
      return () => [];
    }
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});


const { loadTreeData, treeData } = useTree();

const newField = ref(props.fields);

const parkOptions = ref<any[]>([]);
const orgTypeOptions = ref<any[]>([]);
const orgIndustryOptions = ref([]);
const roleOptions = ref([]);

const managementScopePark = ref([]);
const managementScopeParkList = ref([]);
const natureList = ref([]);


const ruleForm = ref();

// 标签和区域相关方法\
const treeRef = ref();
const showOrgTagDialog = ref(false);
const showAreaDialog = ref(false);

const selectOrgTagValues = ref([]);

const selectServiceArea = ref([]);
const selectServiceAreaPark = ref("");
const serviceAreaParkList = ref([]);
// 表单数据
const form = reactive({
  code: "", // 信用代码
  name: "",
  businessLicense: "", // 营业执照
  inPark: [],
  dataLevel: "",
  managementScope: "", // 管理范围
  highTech: "是", // 高新企业
  organizationNature: "", // 组织性质
  organizationCategory: "", // 业务类别
  businessTags: [], // 组织标签
  serviceArea: [], // 服务区域
  industryType: [],
  logo: "",
  companyDescription: "",
  organizationIntroduction: "",
  rongyujieshao: "",
  loginAccount: "",
  loginPassword: "",
  confirmPassword: "",
  roleId: ""
});

// 表单规则
const rules = reactive({
  name: [{ required: true, message: "请输入组织名称", trigger: "change" }],
  dataLevel: [{ required: true, message: "请选择数据级别", trigger: "change" }],
  highTech: [
    { required: true, message: "请选择是否为高新企业", trigger: "change" }
  ],
  organizationNature: [
    { required: true, message: "请选择组织性质", trigger: "change" }
  ],
  organizationCategory: [
    { required: true, message: "请选择组织分类", trigger: "change" }
  ],
  businessTags: [
    { required: true, message: "请选择业务标签", trigger: "change" }
  ],
  industryType: [
    { required: true, message: "请选择产业类型", trigger: "change" }
  ],
  logo: [{ required: true, message: "请上传公司logo", trigger: "change" }],
  companyDescription: [
    { required: true, message: "请输入公司简介", trigger: "change" }
  ],
  loginAccount: [
    { required: true, message: "请输入登录账号", trigger: "change" }
  ],
  loginPassword: [
    { required: true, message: "请输入登录密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6到20个字符", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== form.loginPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

const optionsBasis = ["组织介绍", "荣誉资质"];

const currentValue = ref("组织介绍");

// 产业类型选项
const industryOptions = ref([]);

const getParkOptions = () => {
  getPark({
    pageNum: 1,
    pageSize: 1000
  }).then(res => {
    parkOptions.value = res.data.records;
  });
};

const getNatureList = async () => {
  const { data } = await getOrgNatureTree({
    pageSize: 1000,
    pageNum: 1
  });
  natureList.value = data;
};

const getOrgTypeOptions = () => {
  getOrgType({
    pageNum: 1,
    pageSize: 1000
  }).then(res => {
    orgTypeOptions.value = res.data.records;
  });
};

const getOrgIndustryOptions = async () => {
  try {
    let { data } = await getOrgIndustry();
    let treeList = handleTree(data);
    orgIndustryOptions.value = treeList || [];
  } catch (error) {
    console.error("Failed to load industry categories:", error);
  }
};

const getRoleOptions = async () => {
  let { rows } = await getRoleList({ pageNum: 1, pageSize: 1000 });
  roleOptions.value = rows;
};

const handlChangeRegion = (values: []) => {
  let filterParams = formatRegionValues(values);
  getPark({
    ...filterParams,
    pageNum: 1,
    pageSize: 1000
  }).then(res => {
    managementScopeParkList.value = res.data.records;
  });
};

const handleChangeAreaCasder = (values: []) => {
  let filterParams = formatRegionValues(values);
  getPark({
    ...filterParams,
    pageNum: 1,
    pageSize: 1000
  }).then(res => {
    serviceAreaParkList.value = res.data.records;
  });
};

const handleAddServiceArea = () => {
  
  let areaLable = getSelectedLabels(treeData.value, selectServiceArea.value);
  let parkLable = getSelectedLabels(serviceAreaParkList.value, [
    selectServiceAreaPark.value
  ]);
  let labels = [...areaLable, ...parkLable];
  let values = [...selectServiceArea.value, selectServiceAreaPark.value];

  let obj = {
    name: labels,
    label: labels,
    value: values,
    sendValue: values?.join("&"),
    isSelectPark: parkLable.length > 0,
    parkLable: parkLable,
    parkValue: selectServiceAreaPark.value
  };
  let list = uniqueByKey([...form.serviceArea, obj], "sendValue");
  form.serviceArea = list;
  // 选择园区滞空
  selectServiceAreaPark.value = "";
};

const onSelectOrgTag = values => {
  let list = uniqueByKey([...form.businessTags, ...values], "id");
  form.businessTags = list;
};

const onSelectArea = () => {
  console.log(treeRef.value!.getCheckedKeys(false));
  console.log(treeRef.value!.getCheckedNodes(false, false));
  const checkedNodes = treeRef.value.getCheckedNodes(false, false); // 获取所有选中的节点（不包含半选）
  const paths = getPaths(checkedNodes);

  console.log("paths", paths);
};

// 上传相关方法
const handlePreview = file => {
  console.log(file);
};

const handleRemove = (file, fileList) => {
  console.log(file, fileList);
};

const beforeRemove = (file, fileList) => {
  return confirm(`确定移除 ${file.name}？`);
};

const removeTag = tag => {
  let index = form.businessTags.findIndex(item => item.id === tag.id);
  form.businessTags.splice(index, 1);
};

const removeServiceArea = index => {
  form.serviceArea.splice(index, 1);
}

const transferJson = (data) => {
  if(!data) return ''
  return JSON.stringify(data);
}

const getInitForm = () => {
  let formData = props.fields;
  
  const entries = Object.entries(form); // 转为 [ [key, value] ] 数组
  entries.forEach(([key, value], index) => {
    try {
      let fieldJson = JSON.parse(formData[index]?.fieldJson);
      // 服务区域这里要单独处理
      if (key === 'serviceArea') {
      }
      form[key] = fieldJson?.value || value;
      console.log("form[key]", form[key]);
    } catch (error) {
      console.log(error);
      form[key] = formData[index]?.fieldValue || value;
    }
  })
  console.log("初始化form", form);
}


const getFormData = () => {
  let arr = props.fields.map?.((item) => {
    return {
      fieldName: item.name || item.fieldName,
      fieldParentId: item.parentId || item.fieldParentId,
      id: item.id,
      fieldValue: "",
      fieldJson: ""
    }
  })
  console.log('arr', arr)
  // 这路
  const entries = Object.entries(form); // 转为 [ [key, value] ] 数组
  entries.forEach(([key, value], index) => {
    if (key === 'inPark' && !!value) {
        arr[index] = {
        ...arr[index],
        fieldValue: value?.join(','),
        fieldJson: transferJson(
          {
            label: getSelectedLabels(parkOptions.value, value),
            value: value
          }
        )
      }
    }else if (key === 'managementScope' && value) {
      // 区域label
      let managementScopeLabel = getSelectedLabels(treeData.value, form.managementScope);

      // 园区label
      let parkLabel = getSelectedLabels(managementScopeParkList.value, [managementScopePark.value]);
      let values = [...form.managementScope, managementScopePark.value];
      let isSelectPark = managementScopePark.value.length > 0;
      arr[index] = {
        ...arr[index],
        fieldValue: values.join("&"),
        fieldJson: transferJson(
          {
            label: [...managementScopeLabel, ...parkLabel],
            value: values,
            isSelectPark: isSelectPark,
            parkLabel: parkLabel,
            parkValue: managementScopePark.value
          }
        )
          
      }
    } else if(key === 'organizationNature' && !!value) {
      
      arr[index] = {
        ...arr[index],
        fieldValue: value?.join("&"),
        fieldJson: transferJson(
          {
            label: getSelectedLabels(natureList.value, value),
            value: value
          }
        )
      }
    } else if (key === 'organizationCategory' && !!value) {
      arr[index] = {
        ...arr[index],
        fieldValue: value?.join(','),
        fieldJson: transferJson(
          {
            label: getSelectedLabels(orgTypeOptions.value, value),
            value: value
          }
        )
      }
    } else if (key === 'businessTags' && !!value) {

      let label = value?.map(item => item.name);
      let ids = value?.map(item => item.id);

      arr[index] = {
        ...arr[index],
        fieldValue: ids?.join(','),
        fieldJson: transferJson(
          {
            label: label,
            value: value,
          }
        )
      }
    } else if (key === 'serviceArea' && !!value) {
      let label = value?.map(item => item.label);
      let ids = value?.map(item => item.sendValue);

      arr[index] = {
        ...arr[index],
        fieldValue: ids.join(','),
        fieldJson: transferJson(
          {
            label: label,
            value: value,
          }
        )
      }
    }else if (key === 'industryType' && !!value) {
      arr[index] = {
        ...arr[index],
        fieldValue: value?.join('&'),
        fieldJson: transferJson(
          {
            label: getSelectedLabels(orgIndustryOptions.value, value),
            value: value
          }
        )
      }
    } else if(!!arr[index]?.fieldName){
      arr[index] = {
        ...arr[index],
        fieldValue: value,
        fieldJson: transferJson(
          {
            label: [],
            value: value
          }
        )
      }
    }
  });
  console.log('arr:', arr);
  let dataFileRequests = arr;
  return {
    dataFileRequests: dataFileRequests,
    password: form.loginPassword,
    cmfPassword: form.confirmPassword,
    parkIds: form.inPark?.join(','),
    phone: form.loginAccount
  }
};
const onValidate = () => {
  return new Promise((resolve, reject) => { 
    ruleForm.value.validate(async (validate) => {
      if (!validate) {
        resolve(false)
      } else {
        resolve(true)
      };
    });
  }); 
};

watch(() => props.fields, (newVal) => {
  if (!props.isEdit) return 
  newField.value = newVal
  getInitForm()
}, {
  deep: true,
  immediate: true
})
const initData = () => {
  getParkOptions();
  loadTreeData();
  getNatureList();
  getOrgTypeOptions();
  getOrgIndustryOptions();
  getRoleOptions();
};
onMounted(() => {
  initData();
});
defineExpose({
  getFormData,
  onValidate
})
</script>

<style scoped lang="scss">
.tag-item {
  display: inline-block;
  margin-right: 10px;
}
::v-deep {
  .custom-style .el-segmented {
  }
}
</style>
