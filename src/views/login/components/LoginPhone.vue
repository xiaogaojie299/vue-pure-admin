<script setup lang="tsx">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, reactive, computed } from "vue";
import Motion from "../utils/motion";
import { message } from "@/utils/message";
import { phoneRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { useVerifyCode } from "../utils/verifyCode";
import { useUserStoreHook } from "@/store/modules/user";
import { getLoginByCode } from "@/api/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Iphone from "~icons/ep/iphone";
import Keyhole from "~icons/ri/shield-keyhole-line";
import { initRouter, getTopMenu } from "@/router/utils";
import { addDialog } from "@/components/ReDialog";
import ComponentSelectOrganize from "./SelectOrganize.vue";

const { t } = useI18n();

const isAdmin = computed(() => {
  return useUserStoreHook().orgId == 0;
});
import { getAllOrg } from "@/api/system";


const loading = ref(false);
const router = useRouter();
const ruleForm = reactive({
  phone: "",
  verifyCode: ""
});
const ruleFormRef = ref<FormInstance>();
const { isDisabled, text } = useVerifyCode();
const disabled = ref(false);
const goJumpRouter = () => {
  router
    .push(getTopMenu(true).path)
    .then(() => {
      message(t("login.pureLoginSuccess"), { type: "success" });
    })
    .finally(() => (disabled.value = false));
};

/** 退出登录 */
function logout() {
  useUserStoreHook().logOut();
}

const handleVisibleSelectOrganize = async () => {
  let responseData = await getAllOrg();
  let allOrg = responseData?.data;
  if (allOrg?.length > 0) {
    allOrg = allOrg.map(v => {
      // 这里用的组件 我就直接按照组件的数据格式来写
      return {
        ...v,
        title: v.name,
        value: v.id,
        avatar:
          v?.logo ||
          "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      };
    });
  }
  const selectOrganizeRef = ref();
  if (allOrg?.length === 1) {
    let id = allOrg[0].id;
    useUserStoreHook().SET_ORGID(id);
    goJumpRouter();
    return;
  }

  // 这是多个组织的时候
  addDialog({
    width: "40%",
    title: "检测到您有多个组织，请先选择登录组织",
    draggable: true,
    alignCenter: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    center: true,
    beforeSure: async (done, { options, index }) => {
      // await selectOrganizeRef.value?.onSubmit();
      const { id } = selectOrganizeRef.value?.getCurrent();
      useUserStoreHook().SET_ORGID(id);
      done();
      goJumpRouter();
    },

    beforeCancel: (done, { options, index }) => {
      // 点击取消清除token
      logout();
      disabled.value = false;
      done(); // 需要关闭把注释解开即可
    },

    contentRenderer: () => (
      <ComponentSelectOrganize
        list={allOrg}
        ref={el => (selectOrganizeRef.value = el)}
      />
    )
  });
};

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      useUserStoreHook().loginByCode({
        mobile: ruleForm.phone,
        code: ruleForm.verifyCode
      }).then((res) => {
        if (res.code == 200) {
            // 获取后端路由
            return initRouter().then(asyncRoute => {
              console.log("asyncRoute", asyncRoute);
              isDisabled.value = true;
              // 如果是平台管理员账号登录，则不选择组织，如果是组织账号登录，需要选择组织的账号；
              if (isAdmin.value) {
                goJumpRouter();
                return;
              }
              handleVisibleSelectOrganize();
            });
          } else {
            message(t("login.pureLoginFail"), { type: "error" });
          }
      }).finally(() => (loading.value = false));
    } else {
      loading.value = false;
    }
  });
};

const onSendVerifyCode = async () => {
  await useVerifyCode()?.start(ruleFormRef.value, "phone");
  let response = await useVerifyCode().getVerifyCode({
    mobile: ruleForm.phone
  });

  getLoginByCode({
    mobile: ruleForm.phone,
    code: ruleForm.verifyCode
  });
};

function onBack() {
  useVerifyCode().end();
  useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="phoneRules" size="large">
    <Motion>
      <el-form-item prop="phone">
        <el-input
          v-model="ruleForm.phone"
          clearable
          :placeholder="t('login.purePhone')"
          :prefix-icon="useRenderIcon(Iphone)"
        />
      </el-form-item>
    </Motion>

    <Motion :delay="100">
      <el-form-item prop="verifyCode">
        <div class="w-full flex justify-between">
          <el-input
            v-model="ruleForm.verifyCode"
            clearable
            :placeholder="t('login.pureSmsVerifyCode')"
            :prefix-icon="useRenderIcon(Keyhole)"
          />
          <el-button
            :disabled="isDisabled"
            class="ml-2!"
            @click="onSendVerifyCode"
          >
            {{
              text.length > 0
                ? text + t("login.pureInfo")
                : t("login.pureGetVerifyCode")
            }}
          </el-button>
        </div>
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          :disabled="disabled"
          @click="onLogin(ruleFormRef)"
        >
          {{ t("login.pureLogin") }}
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="200">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          {{ t("login.pureBack") }}
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
