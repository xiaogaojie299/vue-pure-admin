
<!-- src/components/IconForm.vue -->
<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="*icon名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="*ICON图标" prop="iconUrl">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="formData.iconUrl" :src="formData.iconUrl" class="avatar" />
          <div v-else class="upload-placeholder">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <p>上传照片</p>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="排序" prop="order">
        <el-input-number v-model="formData.order" :min="1"></el-input-number>
      </el-form-item>

      <el-form-item label="*所属板块" prop="position">
        <el-select v-model="formData.position" placeholder="请选择">
          <el-option label="科技服务" value="科技服务"></el-option>
          <el-option label="公共服务" value="公共服务"></el-option>
          <el-option label="空间服务" value="空间服务"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="生效周期">
        <el-date-picker
          v-model="formData.validPeriod"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="是否上架">
        <el-radio-group v-model="formData.status">
          <el-radio :label="'已上架'">是</el-radio>
          <el-radio :label="'已下架'">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="跳转板块">
        <el-radio-group v-model="formData.jumpType">
          <el-radio label="资讯列表">资讯列表</el-radio>
          <el-radio label="服务列表">服务列表</el-radio>
          <el-radio label="产品列表">产品列表</el-radio>
          <el-radio label="服务详情">服务详情</el-radio>
          <el-radio label="产品详情">产品详情</el-radio>
          <el-radio label="空间详情">空间详情</el-radio>
          <el-radio label="功能说明">功能说明</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="列表分类" v-if="['资讯列表', '服务列表', '产品列表'].includes(formData.jumpType)">
        <el-cascader
          v-model="formData.category"
          :options="categoryOptions"
          :props="{ checkStrictly: true }"
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item label="跳转内容" v-if="formData.jumpType === '功能说明'">
        <el-input v-model="formData.jumpContent"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  dialogTitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref<FormInstance>()

const rules = reactive({
  name: [{ required: true, message: '请输入icon名称', trigger: 'blur' }],
  iconUrl: [{ required: true, message: '请上传icon图标', trigger: 'change' }],
  position: [{ required: true, message: '请选择所属板块', trigger: 'change' }]
})

const handleAvatarSuccess = (res: any, file: any) => {
  formData.value.iconUrl = URL.createObjectURL(file.raw)
}

const beforeAvatarUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isJpgOrPng) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!')
  }
  if (!isLt1M) {
    ElMessage.error('上传头像图片大小不能超过 1MB!')
  }
  return isJpgOrPng && isLt1M
}

const categoryOptions = [
  // 这里可以动态获取分类选项
  {
    value: '一级分类',
    label: '一级分类',
    children: [
      {
        value: '二级分类',
        label: '二级分类',
        children: [
          {
            value: '三级分类',
            label: '三级分类'
          }
        ]
      }
    ]
  }
]

const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('submit', formData.value)
      closeDialog()
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const closeDialog = () => {
  dialogVisible.value = false
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  background: #fafafa;
}

.upload-placeholder i {
  font-size: 28px;
  color: #8c939d;
}

.upload-placeholder p {
  margin-top: 8px;
  color: #8c939d;
}
</style>