
<template>
  <div>
     <div class="user-info">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-row :gutter="20" style="line-height:30px">
            <el-col :span="24">身份标签：普通用户</el-col>
            <el-col :span="24">用户昵称：{{ userInfo.nickName }}</el-col>
            <el-col :span="24">性别：{{ userInfo?.sex == 0 ? '男' : '女' }}</el-col>

            <el-col :span="24">用户头像：<el-image
              fit="cover"
              :preview-teleported="true"
              :src="userInfo.avatar"
              :preview-src-list="Array.of(row.avatar)"
              class="w-[95px] h-[95px] rounded-full align-middle"
            /></el-col>

            <el-col :span="24">电话号码：{{ userInfo?.phonenumber }}</el-col>
            <el-col :span="24">注册时间：{{ userInfo?.createTime }}</el-col>
            <el-col :span="24">备注（选填）：
              <el-input
                v-model="newRemark"
                placeholder="请输入备注信息"
                :rows="6"
                type="textarea"
              />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
  </div>
      
  </div>

</template>
<script setup lang="ts">
import { ref, defineProps, watch, defineExpose } from 'vue';
import { getUserInfo } from "@/api/user";
import dayjs from "dayjs";

const props = defineProps({
  row: {
    type: Object,
    default: () => {}
  },
})

const userInfo = ref({
 
});
const newRemark = ref();
const getUserInfoDetails = async () => {
  if(!props.row.userId) return; 
  const { data } = await getUserInfo({userId: props.row.userId});
  userInfo.value = data;
};

watch(() => props.row, newValue => {
  // getUserInfoDetails()
  userInfo.value = newValue;
  newRemark.value = newValue?.remark || '';
}, {deep: true, immediate: true})



const certificates = [
  {
    type: '学历证书',
    name: 'MBA证书',
    number: 'FIUYDSF3418342134',
    institution: '广东财经大学',
    image: 'https://example.com/certificate1.jpg'
  },
  // 其他证书...
];

const treeData = [
  // 树状数据...
];

const searchForm = ref({
  username: '',
  status: ''
});

const userData = ref([
  // 用户数据...
]);

const onSearch = () => {
  // 搜索逻辑
};

const resetForm = () => {
  // 重置表单逻辑
};

const handleNodeClick = (data) => {
  // 树节点点击逻辑
};

const handleEdit = (row) => {
  // 编辑用户逻辑
};

const handleDelete = (row) => {
  // 删除用户逻辑
};

const getRemark = () => {
  return newRemark.value;
}
defineExpose({
  getRemark
})
</script>

<style scoped>
.user-info {
  margin-bottom: 20px;
}

.certificate-card {
  margin-bottom: 20px;
}
</style>