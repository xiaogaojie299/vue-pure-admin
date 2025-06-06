// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import {
  system,
  permission,
  organizational,
  categories,
  region
} from "@/router/enums";

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
        title: "添加组织",
        showLink: false
      },
      component: "organizational-management/index/add.vue"
    },
  ]
};

const categoriesManagement = {
  path: "/categoriesManagement",
  name: "CategoriesManagement",
  meta: {
    icon: "ep:price-tag",
    title: "分类设置",
    rank: categories
  },
  children: [
    {
      path: "/categories-management/org-tags",
      name: "CategoriesManagementOrgTags",
      meta: {
        title: "组织标签管理"
      },
      component: "categories-management/org-tags/index.vue"
    },

    {
      path: "/categories-management/org-nature",
      name: "CategoriesManagementOrgNature",
      meta: {
        title: "组织性质管理"
      },
      component: "categories-management/org-nature/index.vue"
    },
    {
      path: "/categories-management/industry-category",
      name: "CategoriesManagementIndustryCategory",
      meta: {
        title: "产业类型"
      },
      component: "categories-management/industry-category/index.vue"
    },
    {
      path: "/categories-management/org-category",
      name: "CategoriesManagementOrgCategory",
      meta: {
        title: "组织分类"
      },
      component: "categories-management/org-category/index.vue"
    },
    {
      path: "/categories-management/org-sub-nature",
      name: "CategoriesManagementOrgSubNature",
      meta: {
        title: "子性质管理",
        showLink: false
      },
      component: "categories-management/org-sub-nature/index.vue"
    }
  ]
}; 

const regionManagement = {
  path: "/region-management",
  name: "RegionManagement",
  meta: {
    icon: "ep:price-tag",
    title: "区域管理",
    rank: region
  },
  children: [
    {
      path: "/region-management/index",
      name: "RegionManagementIndex",
      meta: {
        title: "区域管理"
      },
      component: "/region-management/index/index.vue"
    },

    {
      path: "/region-management/park",
      name: "RegionManagementPark",
      meta: {
        title: "园区管理"
      },
      component: "/region-management/park/index.vue"
    },
    {
      path: "/region-management/edit-park-detail",
      name: "RegionManagementEditParkDetail",
      meta: {
        title: "园区管理",
        showMenu: false
      },
      component: "/region-management/park/edit-park-detail.vue"
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
          organizationalManagement,
          categoriesManagement,
          regionManagement
        ]
      };
    }
  }
]);
