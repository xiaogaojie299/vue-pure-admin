<template>
  <el-dialog v-model="dialogVisible" title="支付方式授权设置" width="50%" center>
    <div class="space-y-4">
      <!-- 微信支付 -->
      <div class="flex items-center justify-between p-4 border rounded">
        <div class="flex items-center">
          <span class="text-green-600 mr-2 text-2xl">
            <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg> -->
            <TdesignLogoWechatpayFilled></TdesignLogoWechatpayFilled>
          </span>
          <span class="text-gray-700">微信支付</span>
          <span  class="ml-2 text-gray-500">提现请线下联系客服</span>

        </div>
        <div class="flex items-center">
          <el-checkbox readonly v-model="wechatPaymentEnabled"></el-checkbox>
        </div>
      </div>

      <!-- 对公转账 -->
      <div class="flex items-center justify-between p-4 border rounded">
        <div class="flex items-center">
          <span class="text-blue-600 mr-2 text-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2" />
            </svg>
          </span>
          <span class="text-gray-700">对公转账</span>
        </div>
        <div class="flex items-center">
          <el-checkbox disabled v-model="publicAccountTransferEnabled"></el-checkbox>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TdesignLogoWechatpayFilled from '~icons/tdesign/logo-wechatpay-filled';
const dialogVisible = ref(false);
const wechatPaymentEnabled = ref(true);
const publicAccountTransferEnabled = ref(true);

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const saveSettings = () => {
  // 这里可以添加保存设置的逻辑
  console.log('保存设置');
  closeDialog();
};

defineExpose({ openDialog });
</script>

<style scoped>
/* 添加一些自定义样式 */
</style>