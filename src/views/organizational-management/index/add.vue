<script setup lang="tsx">
import { defineOptions, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Refresh from "~icons/ep/refresh";
import EpQuestionFilled from "~icons/ep/question-filled";
defineOptions({
  name: "OrganizationalManagementAdd"
});
const formRef = ref();
const form = ref({
  tongyixingyongshehuima: ""
});
</script>
<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <h3>组织介绍</h3>
      </template>

      <el-form label-width="180" ref="formRef" :model="form">
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
        <el-form-item>
          <el-button type="primary" :icon="useRenderIcon('ri:search-line')">
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
