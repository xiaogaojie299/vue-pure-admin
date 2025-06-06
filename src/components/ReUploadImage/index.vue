<template>
  <div class="upload-image-container">
    <el-upload
      v-model:file-list="fileList"
      :action="uploadUrl"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :limit="limit"
      :on-exceed="handleExceed"
      :http-request="customUpload"
      :headers="headers"
      :multiple="multiple"
      :show-file-list="true"
      :on-error="handleError"
    >
      <PlusIcon style="font-size: 4em;"></PlusIcon>
    </el-upload>

    <!-- 预览弹窗 -->
    <el-dialog v-model="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStoreHook } from '@/store/modules/user'
import PlusIcon from "~icons/ep/plus";
import {formUpload} from "@/api/common"
import { createFormData } from "@pureadmin/utils";

// 接口地址

// Props 定义
interface UploadProps {
  modelValue?: string | string[] // 支持单张或多张
  limit?: number // 最大上传数量
  multiple?: boolean // 是否支持多选上传
  headers?: Record<string, any> // 自定义请求头
}

const props = withDefaults(defineProps<UploadProps>(), {
  modelValue: () => [],
  limit: 5,
  multiple: true,
  headers: () => {
    return {
      Authorization: `Bearer ${useUserStoreHook().getToken}`
    }
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success', 'error'])

// 处理文件列表
const fileList = ref<any[]>([])

// 预览相关
const dialogImageUrl = ref('')
const dialogVisible = ref(false)


// 自定义上传函数
const customUpload = async (options: UploadRequestOptions) => {
  const { file, onSuccess, onError } = options
  try {
    const formData = createFormData({
        file: file,
      });
    // 调用你封装的 uploadFile 接口
    const {data: response } = await formUpload(formData)
    console.log('response', response)
    // 假设接口返回的是 { url: 'https://xxx.jpg' }
    if (response && response.url) {
      // 手动设置响应内容
      // onSuccess?.(response.url, file)
      
      // ElMessage.success('上传成功')
      handleSuccess(response, file, [response])
    } else {
      onError?.(new Error('上传失败'))
      ElMessage.error('上传失败，请重试')
    }
  } catch (err) {
    onError?.(err as any)
    ElMessage.error('上传失败，请检查网络或文件')
  }
}

// 文件限制检查
const beforeUpload = (file: File) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  if (!isValidType) {
    ElMessage.error('只能上传 JPG/PNG/GIF 格式的图片')
    return false
  }

  const isValidSize = file.size / 1024 / 1024 < 5 // 限制 5MB
  if (!isValidSize) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }

  return true
}

// 提示超出限制
const handleExceed = (files, fileList) => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

// 移除文件
const handleRemove = (file, fileList) => {
  updateModelValue(fileList)
}

// 预览图片
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 上传成功回调
const handleSuccess = (response, file, fileList) => {
  if (!props.multiple && fileList.length > props.limit) {
    // 如果是单张上传，并且超过限制，只保留最后一个
    fileList.splice(0, fileList.length - 1)
  }

  console.log("上茶成功",response,file, fileList)
  updateModelValue(fileList)
  emit('success', response, file, fileList)
}

// 上传失败回调
const handleError = (error, file, fileList) => {
  ElMessage.error('上传失败，请重试')
  emit('error', error, file, fileList)
}

// 同步更新 modelValue
const updateModelValue = (fileList) => {
  const urls = fileList.map(f => f.response?.url || f.url).filter(Boolean)
  emit('update:modelValue', props.multiple ? urls : urls[0])
}
// 初始化时同步值
watch(
  () => props.modelValue,
  (val) => {
    if (Array.isArray(val)) {
      fileList.value = val.map(url => ({
        url,
        status: 'success'
      }))
    } else if (val) {
      fileList.value = [{ url: val, status: 'success' }]
    } else {
      fileList.value = []
    }
  },
  { immediate: true }
);


// 初始化时同步值
defineExpose({
  fileList
})
</script>

<style scoped>
.upload-image-container :deep(.el-upload--picture-card) {
  
}
.form-display-text {
  display: inline-block;
  padding: 0 10px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #666;
}
</style>