<template>
  <div></div>
</template>
<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";

const router = useRouter();
const id = computed(() => useUserStoreHook().orgId);
onMounted(() => {
  router.push({
      name: "OrganizationalManagementDetails",
      query: {
        id: id.value
      }
    });
}); 
</script>