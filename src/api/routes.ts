import { http } from "@/utils/http";
import { routes, orgOnlyRoutes } from "../../mock/asyncRoutes";
import { useUserStoreHook } from "@/store/modules/user";
import { getRouters } from "@/api/system";

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
  };
  children?: Route[];
}
// 递归查找匹配的路由
function findMatchingRoutes(frontendRoutes: Route[], backendRoutes: any[]): Route[] {
  const matchingRoutes: Route[] = [];

  function matchRoute(frontendRoute: Route, backendRoute: any): boolean {
    if (frontendRoute?.id === backendRoute.id) {
      return true;
    }
    if (frontendRoute.children && backendRoute.children) {
      for (const childFrontend of frontendRoute.children) {
        for (const childBackend of backendRoute.children) {
          if (matchRoute(childFrontend, childBackend)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  for (const backendRoute of backendRoutes) {
    for (const frontendRoute of frontendRoutes) {
      if (matchRoute(frontendRoute, backendRoute)) {
        matchingRoutes.push(frontendRoute);
        break; // 找到一个匹配就跳出内层循环
      }
    }
  }

  return matchingRoutes;
}



export const getAsyncRoutes = async () => {

  let response = await getRouters();
  let backendData = response.data || [];

  let orgId = useUserStoreHook().orgId;
  let _routes = [...routes];

  if(orgId !== 0){
    _routes = [...orgOnlyRoutes, ...routes];
  }
  let newRouter = findMatchingRoutes(_routes, backendData);
  console.log("newRouter", newRouter);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: newRouter, success: true });
    }, 1000);
  });
  return http.request<Result>("get", "/get-async-routes");
};
