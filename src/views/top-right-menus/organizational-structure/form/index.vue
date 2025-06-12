<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import ReCropperPreview from "@/components/ReCropperPreview";
import uploadLine from "~icons/ri/upload-line";
import {formUpload} from "@/api/common"

import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";
import { createFormData, deviceDetection } from "@pureadmin/utils";
import { ElMessage } from 'element-plus'

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    ids: [], // 角色id
    birthday: undefined, // 生日
    positionName: "", // 职位
    avatar: "", // 头像
    title: "新增",
    higherDeptOptions: [],
    deptId: 0,
    nickName: "",
    userName: "",
    password: "",
    phonenumber: "",
    email: "",
    sex: "",
    status: 1,
    remark: ""
  })
});
const imgSrc = ref("");
const cropperBlob = ref();
const cropRef = ref();
const uploadRef = ref();
const isShow = ref(false);

const sexOptions = [
  {
    value: "0",
    label: "男"
  },
  {
    value: "1",
    label: "女"
  }
];
const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

const customUpload = async (options) => {
  console.log("options", options)
  try {
   const { file } = options;
    const formData = createFormData({
        file: file,
      });
    // 调用你封装的 uploadFile 接口
    const {data: response } = await formUpload(formData)
    console.log('response', response)
    // 假设接口返回的是 { url: 'https://xxx.jpg' }
    if (response && response.url) {
      // 手动设置响应内容
      newFormInline.value.avatarUrl = response.url
    } else {
      ElMessage.error('上传失败，请重试')
    }
  } catch (err) {
    ElMessage.error('上传失败，请检查网络或文件')
  }
}
const handleSubmitImage = () => {
};

const handleClose = () => {
  cropRef.value.hidePopover();
  uploadRef.value.clearFiles();
  isShow.value = false;
};

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="8" :xs="24" :sm="24">
        <el-form-item label="头像" prop="avatarUrl">
          <div class="flex flex-col justify-between items-center">
            <el-avatar :size="80" :src="newFormInline.avatarUrl" />
            <el-upload
              ref="uploadRef"
              accept="image/*"
              action="#"
              :limit="1"
              :show-file-list="false"
              :http-request="customUpload"
            >
              <el-button plain class="mt-4!">
                <IconifyIconOffline :icon="uploadLine" />
                <span class="ml-2">上传照片</span>
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
      </re-col>
      <re-col :value="16" :xs="24" :sm="24">
        <el-row :gutter="30">
          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="姓名" prop="userName">
              <el-input
                v-model="newFormInline.userName"
                clearable
                placeholder="请输入"
              />
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="用户性别" prop="sex">
              <!-- <el-select
                v-model="newFormInline.sex"
                placeholder="请选择用户性别"
                class="w-full"
                clearable
              >
                <el-option
                  v-for="(item, index) in sexOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
              
              <el-radio-group v-model="newFormInline.sex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="归属部门" prop="depId">
              <el-cascader
                v-model="newFormInline.deptId"
                class="w-full"
                :options="newFormInline.higherDeptOptions"
                :props="{
                  value: 'deptId',
                  label: 'deptName',
                  emitPath: false,
                  checkStrictly: true
                }"
                clearable
                filterable
                placeholder="请选择归属部门"
              >
                <template #default="{ node, data }">
                  <span>{{ data.deptName }}</span>
                  <span v-if="!node.isLeaf">
                    ({{ data.children.length }})
                  </span>
                </template>
              </el-cascader>
            </el-form-item>
          </re-col>
          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="额外权限" prop="ids">
              <el-select
                v-model="newFormInline.ids"
                placeholder="请选择"
                class="w-full"
                clearable
                multiple
              >
                <el-option
                  v-for="(item, index) in newFormInline.roleOptions"
                  :key="index"
                  :value="item.roleId"
                  :label="item.roleName"
                >
                  {{ item.roleName }}
                </el-option>
              </el-select>
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="电话" prop="phonenumber">
              <el-input
                v-model="newFormInline.phonenumber"
                clearable
                placeholder="请输入"
              />
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="newFormInline.birthday"
                type="date"
                class="w-[160px]!"
                placeholder="请选择"
                :disabled-date="disabledDate"
              />
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="职位" prop="positionName">
              <el-input
                v-model="newFormInline.positionName"
                clearable
                placeholder="请输入"
              />
            </el-form-item>
          </re-col>
          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="昵称" prop="nickName">
              <el-input
                v-model="newFormInline.nickName"
                clearable
                placeholder="请输入"
              />
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="角色权限" prop="roleIds">
              <el-select
                v-model="newFormInline.roleIds"
                placeholder="请选择"
                class="w-full"
                clearable
                multiple
              >
                <el-option
                  v-for="(item, index) in newFormInline.roleOptions"
                  :key="index"
                  :value="item.roleId"
                  :label="item.roleName"
                >
                  {{ item.roleName }}
                </el-option>
              </el-select>
            </el-form-item>
          </re-col>
        </el-row>
      </re-col>
    </el-row>
  </el-form>

  <el-dialog
    v-model="isShow"
    width="40%"
    title="编辑头像"
    destroy-on-close
    :closeOnClickModal="false"
    :before-close="handleClose"
    :fullscreen="deviceDetection()"
  >
    <div style="height: 700px">
      <ReCropperPreview ref="cropRef" :imgSrc="imgSrc" @cropper="onCropper" />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button bg text @click="handleClose">取消</el-button>
        <el-button bg text type="primary" @click="handleSubmitImage">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
