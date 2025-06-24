import { http } from "@/utils/http";
import { routes, orgOnlyRoutes } from "../../mock/asyncRoutes";
import { useUserStoreHook } from "@/store/modules/user";

type Result = {
  success: boolean;
  data: Array<any>;
};
export const getAsyncRoutes = () => {
  let orgId = useUserStoreHook().orgId;
  let _routes = [...routes];

  if(orgId !== 0){
    _routes = [...orgOnlyRoutes, ...routes];
  }
  console.log("_routes", _routes);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: _routes, success: true });
    }, 1000);
  });
  return http.request<Result>("get", "/get-async-routes");
};
