<template>
  <el-form label-width="180" :model="form" :rules="rules" ref="ruleForm">
    <el-form-item label="统一信用社会码" prop="tongyixingyongshehuima">
      <template #label>
        <div class="flex items-center">
          <el-tooltip content="统一社会信用代码" placement="top">
            <EpQuestionFilled></EpQuestionFilled>
          </el-tooltip>
          <span class="ml-1">统一社会信用代码:</span>
        </div>
      </template>
      <el-input
        v-model="form.tongyixingyongshehuima"
        placeholder="请输入"
        clearable
        class="w-[150px]! mr-2"
      />
      <el-button type="primary">查询</el-button>
    </el-form-item>

    <!-- 组织名称 -->
    <el-form-item label="组织名称：" prop="name">
      <el-input v-model="form.name" placeholder="请输入" clearable></el-input>
    </el-form-item>

    <!-- 营业执照 -->
    <el-form-item label="营业执照：">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="form.businessLicense"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">只能上传jpg/png文件</div>
        </template>
      </el-upload>
    </el-form-item>

    <!-- 所在园区 -->
    <el-form-item label="所在园区：">
      <el-select v-model="form.inPark" placeholder="请选择">
        <el-option label="全部园区" :value="0"></el-option>
      </el-select>
    </el-form-item>

    <!-- 数据级别 -->
    <el-form-item label="数据级别：" prop="dataLevel">
      <el-radio-group v-model="form.dataLevel">
        <el-radio label="普通组织">普通组织</el-radio>
        <el-radio label="管理组织">管理组织</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 管理范围 -->
    <el-form-item label="管理范围：" prop="managementScope">
      <el-row :gutter="20" class="w-full">
        <el-col :span="4">
          <el-form-item
            label="国家:"
            prop="country"
            label-position="left"
            :label-width="LABLE_WIDTH"
          >
            <el-select v-model="form.country" placeholder="请选择">
              <el-option label="全部国家" value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="省份:"
            prop="province"
            label-position="left"
            :label-width="LABLE_WIDTH"
          >
            <el-select v-model="form.country" placeholder="请选择">
              <el-option label="全部省份" value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="城市:"
            prop="city"
            label-position="left"
            :label-width="LABLE_WIDTH"
          >
            <el-select v-model="form.city" placeholder="请选择">
              <el-option label="全部城市" value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="区县:"
            prop="county"
            label-position="left"
            :label-width="LABLE_WIDTH"
          >
            <el-select v-model="form.county" placeholder="请选择">
              <el-option label="全部区县" value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="街道:"
            prop="street"
            label-position="left"
            :label-width="LABLE_WIDTH"
          >
            <el-select v-model="form.street" placeholder="请选择">
              <el-option label="全部街道" value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="园区:"
            prop="park"
            label-position="left"
            :label-width="LABLE_WIDTH"
          >
            <el-select v-model="form.park" placeholder="请选择">
              <el-option label="全部园区" value="0"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>

    <!-- 高新企业 -->
    <el-form-item label="*高新企业：" prop="highTech">
      <el-radio-group v-model="form.highTech">
        <el-radio label="是">是</el-radio>
        <el-radio label="否">否</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 组织性质 -->
    <el-form-item label="*组织性质：" prop="organizationNature">
      <el-select v-model="form.organizationNature.primary" placeholder="请选择">
        <el-option label="选项1" value="1"></el-option>
        <el-option label="选项2" value="2"></el-option>
      </el-select>
      <el-select
        v-model="form.organizationNature.secondary"
        placeholder="请选择"
      >
        <el-option label="选项1" value="1"></el-option>
        <el-option label="选项2" value="2"></el-option>
      </el-select>
    </el-form-item>

    <!-- 组织分类 -->
    <el-form-item label="组织分类:">
      <el-select v-model="form.organizationCategory" placeholder="请选择">
        <el-option label="选项1" value="1"></el-option>
        <el-option label="选项2" value="2"></el-option>
      </el-select>
    </el-form-item>

    <!-- 业务标签 -->
    <el-form-item label="业务标签:">
      <el-button type="primary" @click="showTagDialog = true">去选择</el-button>
      <div v-for="tag in form.businessTags" :key="tag" class="tag-item">
        {{ tag }} <i class="el-icon-close" @click="removeTag(tag)"></i>
      </div>
    </el-form-item>

    <!-- 服务区域 -->
    <el-form-item label="服务区域:">
      <el-button type="primary" @click="showAreaDialog = true"
        >去选择</el-button
      >
      <div v-for="area in form.serviceArea" :key="area" class="tag-item">
        {{ area }} <i class="el-icon-close" @click="removeArea(area)"></i>
      </div>
    </el-form-item>

    <!-- 产业类型 -->
    <el-form-item label="产业类型:">
      <el-cascader
        v-model="form.industryType"
        :options="industryOptions"
        clearable
      ></el-cascader>
    </el-form-item>

    <!-- 公司logo -->
    <el-form-item label="公司logo:">
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="form.logo" :src="form.logo" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <!-- 产业类型 -->
    <el-form-item label="公司简述:" prop="companyDescription">
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
        <Editor v-model:value="form.organizationIntroduction"></Editor>
      </el-form-item>
    </template>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item
          label="登录账号:"
          prop="loginAccount"
        >
          <el-input
            v-model="form.loginAccount"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="登录密码:"
          prop="loginAccount"
        >
          <el-input
            type="password"
            v-model="form.loginPassword"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="确认密码:"
          prop="confirmPassword"
        >
          <el-input
            type="password"
            v-model="form.confirmPassword"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="角色:"
          prop=""
        >
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" :icon="useRenderIcon('ri:search-line')">
        搜索
      </el-button>
      <el-button :icon="useRenderIcon(Refresh)"> 重置 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";

import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import Editor from "@/components/Editor.vue";

import Refresh from "~icons/ep/refresh";
import EpQuestionFilled from "~icons/ep/question-filled";

const LABLE_WIDTH = "50px";
// 表单数据
const form = reactive({
  tongyixingyongshehuima: "",
  name: "",
  businessLicense: [],
  inPark: "",
  dataLevel: "普通组织",
  managementScope: {},
  country: "",
  province: "",
  city: "",
  county: "",
  street: "",
  park: "",
  highTech: "是",
  organizationNature: {
    primary: "",
    secondary: ""
  },
  organizationCategory: "",
  businessTags: [],
  serviceArea: [],
  industryType: [],
  logo: "",
  companyDescription: "",
  organizationIntroduction: "",
  loginAccount: "",
  loginPassword: "",
  confirmPassword: ""
});

// 表单规则
const rules = reactive({
  name: [{ required: true, message: "请输入组织名称", trigger: "change" }],
  dataLevel: [{ required: true, message: "请选择数据级别", trigger: "change" }],
  highTech: [
    { required: true, message: "请选择是否为高新企业", trigger: "change" }
  ],
  organizationNature: {
    primary: [{ required: true, message: "请选择一级性质", trigger: "change" }],
    secondary: [
      { required: true, message: "请选择二级性质", trigger: "change" }
    ]
  },
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
    { required: true, message: '请输入登录账号', trigger: 'change' }
  ],
  loginPassword: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.loginPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

const optionsBasis = ["组织介绍", "荣誉资质"];

const currentValue = ref("组织介绍");

// 管理范围选项
const managementOptions = ref([]);

// 产业类型选项
const industryOptions = ref([]);

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

const handleExceed = (files, fileList) => {
  this.$message.warning(
    `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
  );
};

const handleAvatarSuccess = (res, file) => {
  form.logo = URL.createObjectURL(file.raw);
};

const beforeAvatarUpload = file => {
  const isJPG = file.type === "image/jpeg";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    alert("上传头像图片只能是 JPG 格式!");
  }
  if (!isLt2M) {
    alert("上传头像图片大小不能超过 2MB!");
  }
  return isJPG && isLt2M;
};

// 标签和区域相关方法
const showTagDialog = ref(false);
const showAreaDialog = ref(false);

const removeTag = tag => {
  form.businessTags.splice(form.businessTags.indexOf(tag), 1);
};

const removeArea = area => {
  form.serviceArea.splice(form.serviceArea.indexOf(area), 1);
};
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
