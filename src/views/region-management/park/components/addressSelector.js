// 高德地图加载和大渡口区行政区域查询
export class DadukouDistrictMap {
  constructor(mapContainerId, markerCallback) {
    this.map = null;
    this.district = null;
    this.placeSearch = null;
    this.auto = null;
    this.marker = null;
    this.mapContainerId = mapContainerId;
    this.markerCallback = markerCallback;
  }

  // 初始化地图
  initMap() {
    if (!window.AMap) {
      console.error("高德地图未加载");
      return;
    }
    return new Promise((resolve, reject) => {
      // 加载高德地图API
      window.AMap.plugin(["AMap.DistrictSearch"], () => {
        // 创建地图实例
        this.map = new window.AMap.Map(this.mapContainerId, {
          resizeEnable: true,
          // center: [106.53, 29.38], // 大渡口区中心点
          zoom: 12
        });
        // 创建行政区查询实例
        this.district = new window.AMap.DistrictSearch({
          subdistrict: 1, // 显示下一级行政区
          extensions: "all" // 返回完整行政区边界
        });

        const options = {
          city: "重庆市",
          citylimit: true
        };
        // 创建地点搜索服务
        this.placeSearch = new window.AMap.PlaceSearch(options);
        // 文档： https://lbs.amap.com/api/javascript-api-v2/documentation#autocomplete
        this.auto = new window.AMap.AutoComplete({
          input: "tipinput",
          ...options,
          zIndex: 9999, // 高层级
          panel: "tipinput" // 自定义面板
        });

        // 添加地图点击事件
        resolve(this.map);
      });
    });
  }

  // 搜索
  placeSearchDadukou(searchKeyword) {
    if (!searchKeyword) return;
    return new Promise((resolve, reject) => {
      this.placeSearch.search(searchKeyword, (status, result) => {
        console.log("搜索结果", status, result);
        if (status === "complete" && result.poiList) {
          resolve(result);
        } else {
          reject(new Error("搜索失败"));
        }
      });
    });
  }

  autoSelect(callback) {
    const select = e => {
      this.placeSearch?.setCity(e.poi.adcode);
      this.placeSearch?.search(e.poi.name); //关键字查询查询
      callback && callback(e);
    };
    console.log("this.map", this.map);

    this.auto.on("select", select); //注册监听，当选中某条记录时会触发
  }

  // 查询大渡口区边界
  searchDadukouDistrict() {
    return new Promise((resolve, reject) => {
      this.district.search("大渡口区", (status, result) => {
        if (status === "complete") {
          const bounds = result.districtList[0].boundaries;

          // 绘制区域边界
          if (bounds) {
            const polygons = bounds.map(
              bound =>
                new window.AMap.Polygon({
                  path: bound,
                  strokeColor: "#FF0000",
                  strokeWeight: 3,
                  strokeOpacity: 0.8,
                  fillOpacity: 0.3,
                  fillColor: "#1791fc"
                  // zIndex:
                })
            );

            // 将多边形添加到地图
            polygons.forEach(polygon => {
              this.map.add(polygon);

              // 绑定点击事件
              this.bindPolygonEvents(polygon);
            });
            // 地图自适应显示
            this.map.setFitView();

            resolve({
              bounds: bounds,
              polygons: polygons
            });
          }
        } else {
          reject(new Error("查询行政区边界失败"));
        }
      });
    });
  }

  // 绑定多边形事件的函数
  bindPolygonEvents(polygon) {
    // 鼠标移入事件
    polygon.on("mouseover", function (e) {
      polygon.setOptions({
        fillOpacity: 0.5,
        strokeColor: "#0000FF"
      });
    });

    // 鼠标移出事件
    polygon.on("mouseout", function (e) {
      polygon.setOptions({
        fillOpacity: 0.3,
        strokeColor: "#FF0000"
      });
    });

    // 点击事件
    polygon.on("click", e => {
      // 判断点击点是否在多边形内部
      const isInside = polygon.contains(e.lnglat);
      console.log("isInside", isInside, e);

      if (isInside) {
        this.updateMapMarker(e.lnglat.lng, e.lnglat.lat);
        this.markerCallback && this.markerCallback(e);
        /**
         *
         * 
          // 弹出信息窗口
          const infoWindow = new window.AMap.InfoWindow({
            content: `
                      <div style="padding:10px;">
                          <h3>大渡口区</h3>
                          <p>点击位置坐标：</p>
                          <p>经度：${e.lnglat.lng}</p>
                          <p>纬度：${e.lnglat.lat}</p>
                      </div>
                  `,
            offset: new window.AMap.Pixel(0, -30)
          });

          // 在点击位置打开信息窗口
          infoWindow.open(this.map, e.lnglat);
          */
      }
    });
  }
  // 判断点是否在大渡口区
  isPointInDadukou(longitude, latitude) {
    return new Promise((resolve, reject) => {
      this.district.search("大渡口区", (status, result) => {
        if (status === "complete") {
          const bounds = result.districtList[0].boundaries;

          // 使用 AMap.GeometryUtil 判断点是否在多边形内
          const point = new window.AMap.LngLat(longitude, latitude);
          const isInside = bounds.some(bound =>
            window.AMap.GeometryUtil.isPointInRing(point, bound)
          );
          console.log("isInside", isInside);
          resolve(isInside);
        } else {
          reject(new Error("无法获取行政区边界"));
        }
      });
    });
  }
  isValidCoordinate(lng, lat) {
    return (
      !isNaN(lng) &&
      !isNaN(lat) &&
      lng !== null &&
      lat !== null &&
      lng !== undefined &&
      lat !== undefined
    );
  }
  // 更新地图标记
  updateMapMarker(lng, lat) {
    // 清除之前的标记
    if (this.marker) {
      this.map.remove(this.marker);
    }

    this.marker = new window.AMap.Marker({
      position: [lng, lat],
      map: this.map
    });
  }
}

// HTML中需要引入高德地图API
// <script src="https://webapi.amap.com/maps?v=2.0&key=your_amap_key"></script>
// <div id="mapContainer" style="width:100%;height:400px;"></div>
