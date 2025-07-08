import { http } from "@/utils/http";
import { routes, orgOnlyRoutes } from "../constants/asyncRoutes";
import { useUserStoreHook } from "@/store/modules/user";
import { getRouters } from "@/api/system";
import { cloneDeep } from "@pureadmin/utils";

type Result = {
  success: boolean;
  data: Array<any>;
};

// 定义路由接口
interface Route {
  path: string;
  name?: string;
  id?: number;
  meta?: {
    title?: string;
    id?: number; // 注意这里也可能是 meta.id
  };
  children?: Route[];
}

// 扁平化后端路由，提取所有 id 到 Set 中
function extractBackendIds(backendRoutes: any[]): Set<number> {
  const idSet = new Set<number>();

  function traverse(routes: any[]) {
    for (const route of routes) {
      if (route.id !== undefined) {
        idSet.add(route.id);
      }
      if (route.children && route.children.length > 0) {
        traverse(route.children);
      }
    }
  }

  traverse(backendRoutes);
  return idSet;
}

// 过滤前端路由，只保留符合条件的项
function filterFrontendRoutes(
  frontendRoutes: Route[],
  allowedIds: Set<number>
): Route[] {
  function shouldInclude(route: Route): boolean {
    const routeId = route.id ?? route.meta?.id;

    // 如果是 -1，则无需鉴权，直接显示
    if (routeId === -1) {
      return true;
    }

    // 如果存在并且在允许列表中，则保留
    if (routeId !== undefined && allowedIds.has(routeId)) {
      return true;
    }

    // 如果有子路由，检查是否有子路由需要保留
    if (route.children) {
      route.children = route.children.filter(child => shouldInclude(child));
      return route.children.length > 0;
    }

    return false;
  }

  return frontendRoutes.filter(route => shouldInclude(route));
}

export const getAsyncRoutes = async () => {
  let response = await getRouters();
  let backendData = response.data || [];
  
  let frontendRoutes = cloneDeep(routes);
  console.log("frontendRoutes", frontendRoutes);
  // 提取后端返回的所有路由 ID
  const allowedIds = extractBackendIds(backendData);
  console.log("allowedIds", allowedIds);

  // 获取当前用户是否为组织用户，决定是否加入 orgOnlyRoutes
  let orgId = useUserStoreHook().orgId;
  let _routes = [];
  
  if (orgId !== 0) {
    _routes = [...orgOnlyRoutes, ...frontendRoutes];
  }else {
    _routes = [...frontendRoutes];
  }

  console.log("_routes", _routes);

  let newRouter = filterFrontendRoutes(_routes, allowedIds);
  console.log("newRouter", newRouter);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: newRouter, success: true });
    }, 1000);
  });
};
