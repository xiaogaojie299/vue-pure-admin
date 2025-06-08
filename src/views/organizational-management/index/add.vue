<script setup lang="tsx">
import { defineOptions, ref, onMounted } from "vue";

import OrganizationForm from "./components/OrganizationForm.vue"
import ScrollAnchorNav from './components/ScrollAnchorNav.vue';

import Refresh from "~icons/ep/refresh";
import EpQuestionFilled from "~icons/ep/question-filled";

import {getGroupFiled, getAllOrg } from "@/api/organizational-management";

defineOptions({
  name: "OrganizationalManagementAdd"
});
const formRef = ref();
const form = ref({
  tongyixingyongshehuima: ""
});

onMounted(() => {
  getGroupFiled().then((res) => {
    console.log("res",res);
  });
  getAllOrg().then((res) => {
    console.log("res",res);
  });
});
</script>
<template>
  <div>
    <!-- <el-card shadow="never">
      <template #header>
        <h3>组织介绍</h3>
      </template>
      <OrganizationForm></OrganizationForm>
    </el-card> -->
    <!-- 页面内容 -->
    <ScrollAnchorNav
    :anchors="[
      { title: '组织介绍', id: '#part1' },
      { title: '部分2', id: '#part2' }
    ]"
    content-height="82vh"
    :section-style="{ background: 'rgba(0,0,0,0.03)' }"
  >

    <div id="part1">
      <el-card shadow="never">
      <template #header>
        <h3>组织介绍</h3>
      </template>
      <OrganizationForm></OrganizationForm>
    </el-card>
    </div>
    <div id="part2" style="height: 800px;">内容2</div>

  </ScrollAnchorNav>
  </div>
</template>
