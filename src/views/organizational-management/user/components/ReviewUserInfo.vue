
<template>
  <div>
     <div class="user-info">
      <el-row :gutter="20">
        <el-col :span="4">
          <div>
            <el-image
              fit="cover"
              :preview-teleported="true"
              src={userInfo.avatarUrl}
              :preview-src-list="Array.of(row.avatarUrl)"
              class="w-[95px] h-[95px] rounded-full align-middle"
            />
          </div>
          <div class="mt-4">
            <div>昵称：{{userInfo.nickName || '-'}}</div>
          </div>
        </el-col>
        <el-col :span="20">
          <el-row :gutter="20" >
            <el-col :span="8">姓名：{{ userInfo?.userName }}</el-col>
            <el-col :span="8">性别：{{ userInfo?.sex == 0 ? '男' : '女' }}</el-col>
            <el-col :span="8">绑定组织：{{ userInfo?.roleName }}</el-col>
          </el-row>
          <el-row :gutter="20" class="my-4">
            <el-col :span="8">电话：{{ userInfo?.phonenumber }}</el-col>
            <el-col :span="8">生日：{{ dayjs(userInfo?.birthday).format("YYYY-MM-DD HH:mm:ss") }}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">职位：{{ userInfo?.positionName }}</el-col>
            <el-col :span="8">地区：{{ '-'}}</el-col>
          </el-row>
          <el-row :gutter="20" class="my-4">
            <el-col :span="8">注册时间：{{ userInfo?.createTime }}</el-col>
            <el-col :span="8">加入组织时间：{{ userInfo?.createTime}}</el-col>
          </el-row>
        </el-col>
      </el-row>
  </div>
      
  </div>

</template>
<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import { getUserInfo } from "@/api/user";
import dayjs from "dayjs";

const props = defineProps({
  row: {
    type: Object,
    default: () => {}
  }
})

const userInfo = ref({
 
});
const getUserInfoDetails = async () => {
  if(!props.row.userId) return; 
  const { data } = await getUserInfo({userId: props.row.userId});
  userInfo.value = data;
};

watch(() => props.row, newValue => {
  // getUserInfoDetails()
  userInfo.value = newValue;
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
</script>

<style scoped>
.user-info {
  margin-bottom: 20px;
}

.certificate-card {
  margin-bottom: 20px;
}
</style>