<template>
  <div class="audit-detail">
    <el-card shadow="never">
      <template #header>
        <h3>组织基本信息</h3>
      </template>
      <el-form :model="formData" label-width="140px" size="default" label-position="right">
        <!-- 组织基本信息 -->
        <div class="form-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="*唯一信用社会码：">
                <el-input v-model="formData.idCard" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="*组织名称：">
                <el-input v-model="formData.orgName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="*法人姓名：">
                <el-input v-model="formData.legalName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="*注册资本：">
                <el-input v-model="formData.capital" disabled>
                  <template #append>万元</template>
                </el-input> 
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="*成立时间：">
                {{ dayjs(orgCreateTime).format("YYYY-MM-DD HH:mm:ss")}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="*营业执照：">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="formData.coverUrl"
                  :preview-src-list="Array.of(formData.coverUrl)"

                  fit="cover"
                ></el-image>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 法人认证信息 -->
        <div class="form-section" v-if="formData.type === 1">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="认证人类型：">
                  <span>法人认证</span>
                </el-form-item>
              </el-col>
            <el-col :span="12">
              <el-form-item label="法人身份证号：">
                <el-input v-model="formData.legalIdCard" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人手机号：">
                <el-input v-model="formData.legalMobile" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 非法人认证信息 -->
        <div class="form-section" v-else>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="认证人类型：">
                  <span>非法人认证</span>
                </el-form-item>
              </el-col>
            <el-col :span="12">
              <el-form-item label="负责人姓名：">
                <el-input v-model="formData.chargeName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人身份证号：">
                <el-input v-model="formData.chargeIdCard" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="负责人手机号：">
                <el-input v-model="formData.chargeMobile" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="授权书：">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="formData.authorizeUrl"
                  :preview-src-list="Array.of(formData.authorizeUrl)"
                  fit="cover"
                ></el-image>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-divider></el-divider>
      </el-form>

      <el-form ref="auditFormRef" :model="auditForm" :rules="auditFormRules"  label-width="140px" :disabled="!isEdit">
       <!-- 处理结果 -->
       <div class="form-section">
          <h3 class="">处理结果</h3>
          <el-row :gutter="20" class="mt-5">
            <el-col :span="24">
              <el-form-item label="处理结果：" prop="status">
                <el-radio-group v-model="auditForm.status">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="2">拒绝</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template v-if="auditForm.status == 1">
            <el-col :span="12">
              <el-form-item label="组织类型：" prop="orgType">
                <el-cascader
                  v-model="auditForm.orgType"
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录账号：" prop="loginMobile">
                <el-input v-model="auditForm.loginMobile" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="初始密码：" prop="password" v-if="isEdit">
                <el-input v-model="auditForm.password" placeholder="请输入" type="password" show-password></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
              </el-form-item>
            </el-col>
            </template>

            <el-col :span="12">
              <el-form-item label="备注：" prop="remark" :rules="auditForm.status === 2 ? [{required: true, message: '请输入备注', trigger: 'blur'}] : []">
                <el-input type="textarea" v-model="auditForm.remark" :rows="4"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
        <!-- 提交按钮 -->
        <div class="submit-btn">
          <el-button v-if="isEdit" type="primary" @click="handleSubmit">提交</el-button>
          <el-button v-else type="primary" plain @click="handleClose">关闭</el-button>
        </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getOrgApproveDetail, approveOrg  } from "@/api/audit-pending-management"

import {
  getOrgNatureTree
} from "@/api/categories-management";
import dayjs from "dayjs";

interface FormData {
  idCard: string;
  orgName: string;
  legalName: string;
  capital: string;
  orgCreateTime: string;
  coverUrl: string;
  legalIdCard: string;
  legalMobile: string;
  chargeName: string;
  chargeIdCard: string;
  chargeMobile: string;
  authorizeUrl: string;
  processResult: number;
  remarks: string;
}
const route = useRoute();
const router = useRouter();

const formData = ref({
  idCard: '',
  orgName: '',
  legalName: '',
  capital: '',
  orgCreateTime: '',
  coverUrl: '', // 示例图片链接
  legalIdCard: '',
  legalMobile: '',
  chargeName: '',
  chargeIdCard: '',
  chargeMobile: '',
  authorizeUrl: '', // 示例图片链接
  type: 1,
});

const isEdit = ref(false);


const auditFormRules  = ref({
  loginMobile: [
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
  ],
  orgType: [
    { required: true, message: "请选择机构类型", trigger: "change" }
  ],
  processResult: [
    { required: true, message: "请选择审核结果", trigger: "change" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 20,
      message: "请输入6-20位密码",
      trigger: "blur"
    }
  ],
});
const natureList = ref([]);

const auditForm = ref({
  loginMobile: "",      //登录手机号
  orgType: "",
  password: "",
  remark: "",
  status: 1,      // 1: 通过, 2: 驳回
  remark: ""
})
const auditFormRef = ref();

const getNatureList = async () => {
  const { data } = await getOrgNatureTree({
    pageSize: 1000,
    pageNum: 1
  });
  natureList.value = data;
};
const getDetail = async () => {
  const res = await getOrgApproveDetail({ id: route.query.id });

  let response = res.data;

  isEdit.value = response?.status === 0;
  formData.value = response;

  auditForm.value.status = response.status || 1;
  auditForm.value.remark = response.remark;

  if(!isEdit.value) {
    auditForm.value.orgType = response.orgType.split(',');
    auditForm.value.loginMobile = response.loginMobile;
    auditForm.value.password = response.password;
  }

};

const handleSubmit = () => {
  auditFormRef?.value?.validate(async (valid) => {
    if (!valid) return;
    
    let params =  {
      ...auditForm.value, 
      id: formData.value.id,
      orgType: auditForm.value.status == 1 ? auditForm.value.orgType?.join(','): undefined,
    };

    await approveOrg(params);
    router.go(-1)
  });
  // 这里可以添加提交逻辑
};

const handleClose = () => {
  router.go(-1)
}

onMounted(() => {
  getDetail();
  getNatureList()
});
</script>

<style scoped>
.audit-detail {
  padding: 20px;
}

.form-section {
  margin-bottom: 20px;
}

.submit-btn {
  text-align: center;
  margin-top: 20px;
}
</style>