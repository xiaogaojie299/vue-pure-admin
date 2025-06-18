import { http } from "@/utils/http";
import { routes } from "../../mock/asyncRoutes";
type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: routes, success: true });
    }, 1000);
  });
  return http.request<Result>("get", "/get-async-routes");
};
