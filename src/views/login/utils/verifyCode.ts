import type { FormInstance, FormItemProp } from "element-plus";
import { clone } from "@pureadmin/utils";
import { ref } from "vue";
import { sendVerifyCode } from "@/api/user";

const isDisabled = ref(false);
const timer = ref(null);
const text = ref("");
const verifyCode = ref(null);
export const useVerifyCode = () => {
  const start = async (
    formEl: FormInstance | undefined,
    props: FormItemProp,
    time = 60,
    data: any
  ) => {
    if (!formEl) return;
    const initTime = clone(time, true);
    return new Promise(async resolve => {
      await formEl.validateField(props, isValid => {
        if (isValid) {
          clearInterval(timer.value);
          resolve(true);

          isDisabled.value = true;
          text.value = `${time}`;
          timer.value = setInterval(() => {
            if (time > 0) {
              time -= 1;
              text.value = `${time}`;
            } else {
              text.value = "";
              isDisabled.value = false;
              clearInterval(timer.value);
              time = initTime;
            }
          }, 1000);
        }
      });
    });
  };

  const end = () => {
    text.value = "";
    isDisabled.value = false;
    clearInterval(timer.value);
  };

  const getVerifyCode = async (data: any) => {
    return sendVerifyCode(data);
  };

  return {
    isDisabled,
    timer,
    text,
    start,
    end,
    getVerifyCode
  };
};
