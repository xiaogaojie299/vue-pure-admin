<template>
  <div class="agreement-page bg-white">
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" >
      <el-tab-pane v-for="item in list" :key="item.value" :label="item.showLabel" :name="item.value"></el-tab-pane> 
    </el-tabs>

    <!-- 富文本编辑器 -->
    <div class="editor-container">
      <Editor
        v-model="editorContent" 
        />
    </div>
    
    <!-- 保存按钮 -->
    <div class="save-button">
      <el-button type="primary" class="w-[500px]!" @click="saveContent">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

import Editor from "@/components/Editor.vue";
import { agreementType } from "../constants";

import { getGreement, saveGreement } from "@/api/system";
// 
const values = ref({}) as any;

const list = ref(agreementType);

// 当前激活的标签
const activeTab = ref(1);


// 编辑器内容
const editorContent = ref('');

// 切换标签时的处理函数
const handleTabClick = (tab) => {
  editorContent.value = "";
  let type = tab.props.name - 1
  getValue(type);
};

// 保存内容的处理函数
const saveContent = () => {
  let type = activeTab.value - 1;
  saveGreement({
    content: editorContent.value,
    type: type
  }).then(res => {
    getValue(type)
    ElMessage.success('保存成功');
  })
};

const getValue = (type) => {
  getGreement({
    type
  }).then(resp => {
    editorContent.value = resp.data?.content;
  })
}

onMounted(() => {
  getValue(activeTab.value);
})
</script>

<style lang="scss" scoped>
.agreement-page {
  padding: 20px;

  .editor-container {
    margin-top: 20px;
  }

  .save-button {
    margin-top: 20px;
    text-align: center;
  }
}
</style>