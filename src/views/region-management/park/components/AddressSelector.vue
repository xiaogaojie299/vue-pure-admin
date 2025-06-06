<!-- 地址选择组件 AddressSelector.vue -->
<template>
  <div class="address-selector">
        <!-- 地图加载状态 -->
        <div v-if="!mapLoaded" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div
              class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"
            />
            <p>地图加载中...</p>
          </div>
        </div>

        <!-- 地图容器 -->
        <div v-show="mapLoaded" id="mapContainer" class="w-full h-[400px] mb-4" />
        <!-- 选中地址展示 -->
        <div class="mb-4 text-gray-700" v-if="selectedLocation?.address">
          <p>当前地址：{{ selectedLocation.address }}</p>
          <p v-if="selectedLocation.lng">
            坐标：{{ selectedLocation.lng }}, {{ selectedLocation.lat }}
          </p>
        </div>
        <div>
        </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { DadukouDistrictMap } from "./addressSelector.js";
import {
  ref,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
  computed
} from "vue";

import { CircleCheckFilled, Search } from "@element-plus/icons-vue";

// 组件props和事件
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  longitude: {
    type: String,
    default: ""
  },
  latitude: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue", "address-selected"]);
const displayAddress = computed({
  get() {
    return props.modelValue;
  },
  set(n) {
    emit("update:modelValue", n);
  }
});
// 响应式状态
const isModalVisible = ref(false);
const mapLoaded = ref(false);
const searchKeyword = ref("");
const detailAddress = ref("");
const selectedLocation = ref(null);
const selectedLocationName = ref("");
const poiList = ref([]);

let dadukouMap = null;
let map = null;

// 打开地址选择弹窗
const openAddressModal = () => {
  window._AMapSecurityConfig = {
    securityJsCode: "9813966841b88d6740664dfbf1580f72"
  };

  const script = document.createElement("script");
  script.src =
    "https://webapi.amap.com/maps?v=2.0&key=ac404b895f53fec3d72ebda98716e111&plugin=AMap.PlaceSearch,AMap.Geocoder,AMap.AutoComplete";
  script.async = true;
  script.onload = () => {
    console.log("高德地图加载完成");
  };
  document.head.appendChild(script);

  isModalVisible.value = true;
  mapLoaded.value = true;
  // 延迟初始化地图，确保DOM已渲染
  setTimeout(initMap, 500);
};

// 关闭弹窗
const closeModal = () => {
  isModalVisible.value = false;
  mapLoaded.value = false;
  resetState();
};

// 重置状态
const resetState = () => {
  searchKeyword.value = "";
  detailAddress.value = "";
  selectedLocation.value = {
    address: "",
    lng: "",
    lat: ""
  };
  poiList.value = [];
};

// 使用示例
const initDadukouMap = async () => {
  try {
    // 确保已经引入高德地图API
    dadukouMap = new DadukouDistrictMap("mapContainer", e => {
      reverseGeocoding(e.lnglat.lng, e.lnglat.lat).then(() => {
        // searchAddress(selectedLocation.value.address);
      });
    });

    // 初始化地图
    map = await dadukouMap.initMap();
    handleAutoSelect();

    map.on("click", handleMapClick);
    if (props.longitude) {
      updateMapMarker(props.longitude, props.latitude);
      selectedLocation.value.lng = props.longitude;
      selectedLocation.value.lat = props.latitude;
    }

  } catch (error) {
    console.error("初始化失败:", error);
  }
};

// 初始化地图
const initMap = () => {
  resetState();
  selectedLocation.value.address = props?.modelValue;
  // dadukouMap.updateMapMarker([116.397477, 39.908692]);
  initDadukouMap();
};

// 处理地图点击事件
const handleMapClick = async e => {
  console.log("地图点击事件:", e);
  const { lng, lat } = e.lnglat;
    updateMapMarker(lng, lat);
};

// 检查坐标是否在大渡口区范围内
const isPointInDadukou = async (lng, lat) => {
  const isInside = await dadukouMap.isPointInDadukou(lng, lat);

  return isInside;
};

// 更新地图标记
const updateMapMarker = (lng, lat) => {
  return dadukouMap.updateMapMarker(lng, lat);
};

// 地址逆geocoding
const reverseGeocoding = (lng, lat) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.AMap.Geocoder({
      city: "重庆市",
      key: "5718981fc6a230430dfa15aaa21a0569"
    });

    geocoder.getAddress([lng, lat], (status, result) => {
      console.log("逆地理编码结果：", status, result);

      if (status === "complete" && result.regeocode) {
        selectedLocation.value = {
          address: result.regeocode.formattedAddress,
          lng,
          lat
        };
        resolve();
      }
    });
  });
};

// 搜索地址
const searchAddress = async (address) => {
  const result = await dadukouMap.placeSearchDadukou(
    address
  );

  const firstPoi = result.poiList.pois[0];
  const { lng, lat } = firstPoi.location;
  

    selectedLocation.value = {
      address: firstPoi.name,
      lng,
      lat
    };
    poiList.value = result.poiList.pois;

    map.setCenter([lng, lat]);
    updateMapMarker(lng, lat);
    
    return {
    lng,
    lat
  }
};

// 确认选择地址
const confirmAddress = () => {
  if (!selectedLocation.value) {
    ElMessage.error("请先选择地址");
    return;
  }

  // 组合最终地址
  const finalAddress = `${selectedLocation.value.address}${detailAddress.value}`;

  // 更新显示地址
  displayAddress.value = finalAddress;

  // 触发事件
  emit("update:modelValue", finalAddress);
  emit("address-selected", {
    ...selectedLocation.value,
    // selectedLocation.lng
    detailAddress: detailAddress.value
  });

  // 关闭弹窗
  closeModal();
};

const handleSelectLocation = (item, index) => {
  selectedLocation.value = {
    address: item.address,
    lng: item.location.lng,
    lat: item.location.lat
  };
};

const handleAutoSelect = () => {
  dadukouMap.autoSelect(e => {
    updateMapMarker(e.poi.location.lng, e.poi.location.lat);
    selectedLocation.value = {
      address: e.poi.name,
      lng: e.poi.location.lng,
      lat: e.poi.location.lat
    };
  });
};
// 动态加载高德地图
onMounted(() => {
  openAddressModal()
});

// 清理资源
onUnmounted(() => {
  if (map) {
    map?.destroy();
  }
});
defineExpose({
  searchAddress
})
</script>

<style scoped lang="scss">
.loader {
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}
::v-deep {
  .amap-autocomplete-suggestion {
    z-index: 9999 !important;
  }
  .amap-copyright,
  .amap-logo {
    display: none !important;
  }
}
/* 或者更精确的选择器 */
#tipinput + .amap-autocomplete-suggestion {
  z-index: 9999 !important;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
