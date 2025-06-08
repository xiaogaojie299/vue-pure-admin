
import { type Ref, ref, onMounted, nextTick } from "vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";

import {
  getRegion,
} from "@/api/region-management";
export function useTree() {
  const treeData = ref([]);
  const loading = ref(true);
  const originalFields = ["country", "province", "market", "area", "street"];

    function formatName(data, key = "name") {
      data.forEach(item => {
        originalFields.map(field => {
          if (item[field]) {
            item[key] = item[field];
          }
        });
      });
      return data;
    }
  
  
    /**
     * 获取选中节点的 label 路径
     * @param data 树形数据源
     * @param selectedIds 选中的 id 列表
     * @returns string[]
     */
    function getSelectedLabels(data, selectedIds) {
      const result = [];
      function findLabelById(data, id) {
        for (const node of data) {
          if (node.id === id) {
            return node.name;
          }
          if (node.children) {
            const found = findLabelById(node.children, id);
            if (found) return found;
          }
        }
        return null;
      }
  
      for (const id of selectedIds) {
        const label = findLabelById(data, id);
        if (label) result.push(label);
      }
  
      return result;
    }
  
  
  // 异步加载树形数据
  const loadTreeData = async () => {
    loading.value = true;
    try {
      let { data } = await getRegion();

      // 这里是将后端反的字段统一成namem，用户后续操作
      data = formatName(data);

      // 后端返回的数据需要我们自己生成树的结构
      let treeList = handleTree(data);

      treeData.value = treeList || [];

    } catch (error) {
      message("加载区域数据失败");
      console.error("Failed to load industry categories:", error);

    } finally {
      loading.value = false;
    }
  };

    // onMounted(() => {
    //   nextTick(() => {
    //     loadTreeData();
    //   })
    // });
  
  return {
    loadTreeData,
    getSelectedLabels,
    treeData,
    loading,
  }
}
