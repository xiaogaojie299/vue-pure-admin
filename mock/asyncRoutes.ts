// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { system, permission, organizational } from "@/router/enums";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const systemManagementRouter = {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "menus.pureSysManagement",
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      meta: {
        icon: "ri:admin-line",
        title: "menus.pureUser"
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      meta: {
        icon: "ri:admin-fill",
        title: "menus.pureRole"
      }
    },
    {
      path: "/system/menu/index",
      name: "SystemMenu",
      meta: {
        icon: "ep:menu",
        title: "menus.pureSystemMenu",
        roles: []
      }
    },
    {
      path: "/system/dept/index",
      name: "SystemDept",
      meta: {
        icon: "ri:git-branch-line",
        title: "menus.pureDept",
        roles: []
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "menus.purePermission",
    icon: "ep:lollipop",
    rank: permission
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "menus.purePermissionPage",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "menus.purePermissionButton",
        roles: ["admin", "common"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "menus.purePermissionButtonRouter",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "menus.purePermissionButtonLogin"
          }
        }
      ]
    }
  ]
};

const organizationalManagement = {
  path: "/organizational-management",
  meta: {
    icon: "ep:office-building",
    title: "组织管理",
    rank: organizational
  },
  children: [
    {
      path: "/organizational-management/index",
      name: "OrganizationalManagementIndex",
      meta: {
        title: "组织管理"
      },
      component: "organizational-management/index/index.vue"
    },
    {
      path: "/organizational-structure/add",
      name: "OrganizationalManagementAdd",
      meta: {
        title: "添加组织"
      },
      component: "organizational-management/index/add.vue"
    }
  ]
};

const organizationalStructure = {
  path: "/organizational-structure",
  isFixed: true,
  meta: {
    title: "组织架构",
    icon: "ep:lollipop"
  },
  children: [
    {
      path: "/top-right-menus/organizational-structure/index",
      name: "TopRightOrganizationalStructure",
      meta: {
        title: "组织架构"
      }
    }
  ]
};

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          permissionRouter,
          systemManagementRouter,
          organizationalStructure,
          organizationalManagement
        ]
      };
    }
  }
]);
