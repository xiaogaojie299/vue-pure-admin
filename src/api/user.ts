import { http } from "@/utils/http";
import { baseUrlApi } from "@/utils/http/baseUrlApi";

export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type UserInfo = {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = {
  success: boolean;
  data: UserInfo;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("auth/login"), { data });
};

/** 验证码登录 */
export const getLoginByCode = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("auth/codeLogin"), {
    data
  });
};

/** 发送验证码 */
export const sendVerifyCode = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("/auth/sendCode"), {
    data
  });
};

/** 获取用户身份 */
export const getUserIdentity = (data?: object) => {
  return http.request("post", baseUrlApi("/system/user/getUserIdentity"), {
    data
  });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfoResult>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return http.request<ResultTable>("get", "/mine-logs", { data });
};

export const addUser = (data?: object) => {
  return http.request<ResultTable>("post", baseUrlApi(`system/user`), {
    data
  });
};

export const editUser = (data?: object) => {
  return http.request<ResultTable>("put", baseUrlApi(`system/user`), {
    data
  });
};

export const getUserList = (data?: object) => {
  return http.request<ResultTable>("get", baseUrlApi(`system/user/list`), {
    data
  });
};

export const getUserInfo = (data) => {
  return http.request<ResultTable>("get", baseUrlApi(`system/user/getInfo`), {
    data
  });
};

export const getUserAuthRole = (data?: object) => {
  return http.request<ResultTable>("get", baseUrlApi(`system/user/authRole`), {
    data
  });
};