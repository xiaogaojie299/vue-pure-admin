<script setup lang="ts">
import { ref, defineExpose, defineProps, withDefaults, onMounted } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/deptRule";
import {
  getOrgPage,
} from "@/api/organizational-management";

interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  parentId: number;
  name: string;
  principal: string;
}
interface FormProps {
  formInline: FormItemProps;
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: {
    type: Object,
    default: () => ({
      higherDeptOptions: [],
      parentId: 0,
      name: "",
      principal: ""
    })
  }
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const orgList = ref([]);
function getRef() {
  return ruleFormRef.value;
}

async function getOrgList() {
  const { data } = await getOrgPage(
      {
        pageSize: 999,
        pageNum: 1
      }
  );
  orgList.value = data.records;
}

function handleChangeExternalOrgId(value) {
  let current = orgList.value.find(item => item.id === value);
  newFormInline.value.externalOrgName = current.name;
}

defineExpose({ getRef });
onMounted(() => {
  getOrgList();
});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="上级部门">
          <el-cascader
            v-model="newFormInline.parentId"
            class="w-full"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: 'deptId',
              label: 'deptName',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.deptName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="部门类型" prop="type" required>
          <el-radio-group v-model="newFormInline.type">
              <el-radio :label="1">内部组织</el-radio>
              <el-radio :label="2">外部组织</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>
      <re-col v-if="newFormInline.type === 1">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="newFormInline.deptName"
            clearable
            placeholder="请输入部门名称"
          />
        </el-form-item>
      </re-col>

      <re-col v-else>
        <el-form-item label="外部组织" prop="externalOrgId">
          <el-select v-model="newFormInline.externalOrgId" placeholder="请输入" filterable @change="handleChangeExternalOrgId">
              <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id" >
              </el-option>
          </el-select>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
