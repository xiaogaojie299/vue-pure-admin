import { useUserStoreHook } from "@/store/modules/user";
import { computed, ref, onMounted, nextTick } from "vue";
import { getAllOrg } from "@/api/system";

import { addDialog } from "@/components/ReDialog";
import ComponentSelectOrganize from "@/views/login/components/SelectOrganize.vue";
import { use } from "echarts";


export function useOrg() {
  const allOrgList = ref([]);

  const handleVisibleSelectOrganize = async () => {
    let allOrg = allOrgList.value;
    const selectOrganizeRef = ref();
    // 这是多个组织的时候
    addDialog({
      width: "30%",
      title: "检测到您有多个组织，请先选择登录组织",
      draggable: true,
      alignCenter: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      center: true,
      beforeSure: async (done, { options, index }) => {
        const { id } = selectOrganizeRef.value?.getCurrent();
        useUserStoreHook().SET_ORGID(id);
        done();
      },
  
      beforeCancel: (done, { options, index }) => {
        // 点击取消清除token
        done(); // 需要关闭把注释解开即可
      },
  
      contentRenderer: () => (
        <ComponentSelectOrganize
          list={allOrg}
          ref={el => (selectOrganizeRef.value = el)}
        />
      )
    });
    setTimeout(() => {
      selectOrganizeRef?.value?.initCurrent(useUserStoreHook().orgId);
    }, 500);
  }
  
  const initData = () => {
    getAllOrg().then(res => {
      let allOrg = res?.data;

      if (allOrg?.length > 0) {

        allOrg = allOrg?.map(v => {
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

      allOrgList.value = allOrg;

    });
  };

  onMounted(() => {
    initData();
  });

  return {
    allOrgList,
    handleVisibleSelectOrganize
  };
}