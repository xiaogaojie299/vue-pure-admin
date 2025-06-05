<template>
  <div class="region-selector">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="所属区域" prop="region">
        <el-cascader
          v-model="form.region"
          :options="options"
          :props="cascaderProps"
          @change="handleChange"
          clearable
          placeholder="请选择所属区域"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟数据源（实际应用中应从接口获取）
const options = [
  {
    value: 'province1',
    label: '省份1',
    children: [
      {
        value: 'city1',
        label: '城市1',
        children: [
          {
            value: 'district1',
            label: '区县1',
            children: [
              { value: 'community1', label: '社区1' },
              { value: 'community2', label: '社区2' }
            ]
          },
          {
            value: 'district2',
            label: '区县2',
            children: [
              { value: 'community3', label: '社区3' },
              { value: 'community4', label: '社区4' }
            ]
          }
        ]
      },
      {
        value: 'city2',
        label: '城市2',
        children: [
          {
            value: 'district3',
            label: '区县3',
            children: [
              { value: 'community5', label: '社区5' },
              { value: 'community6', label: '社区6' }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 'province2',
    label: '省份2',
    children: [
      {
        value: 'city3',
        label: '城市3',
        children: [
          {
            value: 'district4',
            label: '区县4',
            children: [
              { value: 'community7', label: '社区7' },
              { value: 'community8', label: '社区8' }
            ]
          }
        ]
      }
    ]
  }
]

// 级联配置
const cascaderProps = {
  multiple: true, // 所有层级都支持多选
  checkStrictly: true, // 允许半选状态
  expandTrigger: 'hover'
}

// 表单数据
const form = reactive({
  region: []
})

// 表单验证规则
const rules = {
  region: [
    { required: true, message: '请选择所属区域', trigger: 'change' }
  ]
}

// 表单引用
const formRef = ref(null)

// 处理级联选择变化
const handleChange = (value) => {
  if (value.length === 0) return

  const selectedLabels = getSelectedLabels(value)
  console.log('Selected Value:', value)
  console.log('Selected Labels:', selectedLabels)
}

// 根据选中的 value 获取对应的 label
const getSelectedLabels = (selectedValues) => {
  const result = []

  const findLabelByValue = (data, values, labels = []) => {
    for (const item of data) {
      if (values.includes(item.value)) {
        labels.push(item.label)
        if (item.children && values.includes(item.value)) {
          findLabelByValue(item.children, values, labels)
        }
      }
    }
    return labels
  }

  selectedValues.forEach(value => {
    const labels = findLabelByValue(options, value.split('/'))
    result.push(labels.join(' / '))
  })

  return result
}

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const selectedValues = form.region
      const selectedLabels = getSelectedLabels(selectedValues)

      // 构建最终的选中值对象
      const selectedData = selectedValues.map((value, index) => ({
        value: value,
        label: selectedLabels[index]
      }))

      console.log('Form Data:', selectedData)
      // 提交 formData 到后端
    } else {
      ElMessage.error('请正确填写表单')
      return false
    }
  })
}
</script>

<style scoped>
.region-selector {
  padding: 20px;
}
</style>