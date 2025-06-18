<template>
  <div class="audit-form">
    <div class="info-section flex justify-center">
      <div>
        <p>申请组织：{{ formData.parkName }}</p>
        <p>手机号码：{{ formData.mobile }}</p>
        <p>真实姓名：{{ formData.name }}</p>
        <p>申请职位：{{ formData.positionName }}</p>
      </div>
    </div>
    <el-divider></el-divider>
    <el-form label-width="100px" ref='ruleFormRef'  :model="formData" :disabled="!isEdit">
      <el-form-item label="处理结果：">
        <el-radio-group v-model="formData.status" prop="status" :rules="[{ required: true, message: '请选择处理结果', trigger: 'blur' }]">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属部门：">
        <el-select v-model="formData.roleId">
              <el-option
                v-for="item in roleOptions"
                :label="item.roleName"
                :value="item.roleId"
                :key="item.roleId"
              ></el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入不超过200字备注"
          v-model="formData.remark"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import {useDept} from "@/views/top-right-menus/organizational-structure/utils/deptHook";
// const { treeData } =  useDept();
import { getRoleList } from "@/api/system";

interface FormProps {
  formInline: {
    status: number;
    roleId: number;
    remark: string;
  },
  isEdit: Boolean;

}

const ruleFormRef = ref();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    status: 1,
    remark: "",
    roleId: ""
  }),
  isEdit: false

});

const roleOptions = ref([]);


const formData = ref(props.formInline);

const getRoleOptions = async () => {
  let { rows } = await getRoleList({ pageNum: 1, pageSize: 1000 });
  roleOptions.value = rows;
};

function getRef() {
  return ruleFormRef.value;
}

onMounted(() => {
  getRoleOptions();
});

defineExpose({ getRef });
 

</script>

<style scoped>
.audit-form {
  padding: 20px;
  width: 600px;
  margin: 0 auto;
}

.info-section p {
  margin: 5px 0;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>