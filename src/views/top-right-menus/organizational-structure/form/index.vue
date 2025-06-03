<script setup lang="ts">
import { ref } from "vue";
import { formUpload } from "@/api/mock";
import ReCol from "@/components/ReCol";
import ReCropperPreview from "@/components/ReCropperPreview";
import uploadLine from "~icons/ri/upload-line";

import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";
import { createFormData, deviceDetection } from "@pureadmin/utils";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    ids: [], // 角色id
    birthday: undefined, // 生日
    zhiwei: "", // 职位
    avatar: "", // 头像
    title: "新增",
    higherDeptOptions: [],
    parentId: 0,
    nickname: "",
    username: "",
    password: "",
    phone: "",
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
    value: 0,
    label: "男"
  },
  {
    value: 1,
    label: "女"
  }
];
const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

const onChange = uploadFile => {
  const reader = new FileReader();
  reader.onload = e => {
    imgSrc.value = e.target.result as string;
    isShow.value = true;
  };
  reader.readAsDataURL(uploadFile.raw);
};

const handleSubmitImage = () => {
  const formData = createFormData({
    files: new File([cropperBlob.value], "avatar")
  });
  formUpload(formData)
    .then(({ success, data }) => {
      if (success) {
        message("更新头像成功", { type: "success" });
        handleClose();
      } else {
        message("更新头像失败");
      }
    })
    .catch(error => {
      message(`提交异常 ${error}`, { type: "error" });
    });
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
        <el-form-item label="头像" prop="avatar">
          <div class="flex flex-col justify-between items-center">
            <el-avatar :size="80" :src="formInline.avatar" />

            <el-upload
              ref="uploadRef"
              accept="image/*"
              action="#"
              :limit="1"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onChange"
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
            <el-form-item label="姓名" prop="username">
              <el-input
                v-model="newFormInline.username"
                clearable
                placeholder="请输入"
              />
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="用户性别">
              <el-select
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
              </el-select>
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="归属部门">
              <el-cascader
                v-model="newFormInline.parentId"
                class="w-full"
                :options="newFormInline.higherDeptOptions"
                :props="{
                  value: 'id',
                  label: 'name',
                  emitPath: false,
                  checkStrictly: true
                }"
                clearable
                filterable
                placeholder="请选择归属部门"
              >
                <template #default="{ node, data }">
                  <span>{{ data.name }}</span>
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
                  :value="item.id"
                  :label="item.name"
                >
                  {{ item.name }}
                </el-option>
              </el-select>
            </el-form-item>
          </re-col>

          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="电话" prop="phone">
              <el-input
                v-model="newFormInline.phone"
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
            <el-form-item label="职位" prop="zhiwei">
              <el-input
                v-model="newFormInline.zhiwei"
                clearable
                placeholder="请输入"
              />
            </el-form-item>
          </re-col>
          <re-col :value="12" :xs="24" :sm="24">
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="newFormInline.nickname"
                clearable
                placeholder="请输入"
              />
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
