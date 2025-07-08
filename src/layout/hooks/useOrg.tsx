import { useUserStoreHook } from "@/store/modules/user";
import { computed, ref, onMounted, nextTick } from "vue";
import { getAllOrg } from "@/api/system";

import { addDialog } from "@/components/ReDialog";
import ComponentSelectOrganize from "@/views/login/components/SelectOrganize.vue";

import { useRouter } from "vue-router";
import { createTypeReferenceDirectiveResolutionCache } from "typescript";
import { initRouter } from "@/router/utils";
import { storageLocal } from "@pureadmin/utils";

export function useOrg() {
  const allOrgList = ref([]);
  const router = useRouter();

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
        // 每个组织的路由可能不一样，这里刷新一下路由
        storageLocal().removeItem("async-routes");
        initRouter();
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
    if (useUserStoreHook().orgId === 0) {
      return;
    }
    
    getAllOrg().then(res => {
      let allOrg = res?.data;

      if (allOrg?.length > 0) {

        allOrg = allOrg?.map(v => {
          // 这里用的组件 我就直接按照组件的数据格式来写
          return {
            ...v,
            title: v.name,
            value: v.id,
            description: v.score + "",
            avatar:
              v?.logoUrl ||
              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          };
        });

      }

      allOrgList.value = allOrg;

    });
  };

  const handleGoOrgDetail = () => { 
    router?.push({
      name: "OrganizationalOnlyManagementDetail",
      query: {
        id: useUserStoreHook()?.orgId
      }
    });
  };

  onMounted(() => {
    initData();
  });

  return {
    allOrgList,
    handleVisibleSelectOrganize,
    handleGoOrgDetail
  };
}