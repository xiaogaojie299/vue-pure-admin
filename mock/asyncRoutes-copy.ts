// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import {
  system,
  permission,
  organizational,
  categories,
  region,
  systemSet
} from "@/router/enums";
import path from "path";

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
      path: "/organizational-structure/org-user",
      name: "OrganizationalManagementOrgUser",
      meta: {
        title: "组织用户管理"
      },
      component: "organizational-management/user/index.vue"
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
    {
      path: "/organizational-structure/details",
      name: "OrganizationalManagementDetails",
      meta: {
        title: "组织详情",
        showLink: false
      },
      component: "organizational-management/index/details.vue"
    },
    {
      path: "/organizational-structure/edit-log",
      name: "OrganizationalManagementEditLog",
      meta: {
        title: "修改日志",
        showLink: false
      },
      component: "organizational-management/index/edit-log.vue"
    },
    {
      path: "/organizational-structure/log-details",
      name: "OrganizationalManagementLogDetails",
      meta: {
        title: "日志详情",
        showLink: false
      },
      component: "organizational-management/index/log-details.vue"
    },
    {
      path: "/organizational-structure/score",
      name: "OrganizationalManagementScore",
      meta: {
        title: "创新积分权重设置"
      },
      component: "organizational-management/score/index.vue"
    }
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

const auditPendingManagement = {
  path: "/audit-pending-management",
  name: "AuditPendingManagement",
  meta: {
    title: "入驻管理",
    rank: 9,
    icon: "ep:coordinate"
  },
  children: [
    {
      path: "/audit-pending/management/user",
      name: "AuditPendingManagementUser",
      meta: {
        title: "用户加入申请"
      },
      component: "audit-pending-management/user/index.vue"
    },
    {
      path: "/audit-pending/management/org",
      name: "AuditPendingManagementOrg",
      meta: {
        title: "添加组织申请"
      },
      component: "audit-pending-management/org/index.vue"
    },
    {
      path: "/audit-pending/management/org-detail",
      name: "AuditPendingManagementOrgDetail",
      meta: {
        title: "添加组织详情",
        showLink: false,
      },
      component: "audit-pending-management/org/detail.vue"
    }
  ]
};

const regionManagement = {
  path: "/region-management",
  name: "RegionManagement",
  meta: {
    icon: "ep:menu",
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
      component: "region-management/index/index.vue"
    },

    {
      path: "/region-management/park",
      name: "RegionManagementPark",
      meta: {
        title: "园区管理"
      },
      component: "region-management/park/index.vue"
    },
    {
      path: "/region-management/edit-park-detail",
      name: "RegionManagementEditParkDetail",
      meta: {
        title: "园区管理",
        showLink: false
      },
      component: "region-management/park/edit-park-detail.vue"
    }
  ]
};

const systemUesr = {
  path: "/system/user",
  name: "SystemUser",
  meta: {
    icon: "ep:user",
    title: "系统用户管理"
  },
  redirect: "/system/user/tourist",
  children: [
    // {
    //   path: "/system/user/test",
    //   name: "SystemUserTest ",
    //   meta: {
    //     title: "测试"
    //   },
    //   component: "/system-user/test/index.vue"
    // },
    {
      path: "/system/user/tourist",
      name: "SystemUserTourist ",
      meta: {
        title: "游客中心"
      },
      component: "system-user/tourist/index.vue"
    }
  ]
};


const systemSetting = {
  path: "/system-setting",
  name: "SystemSetting",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统设置",
    rank: systemSet
  },
  children: [
    {
      path: "/system-setting/banner",
      name: "SystemSettingBanner",
      meta: {
        title: "banner管理"
      },
      component: "system-setting/banner/index.vue"
    },

    {
      path: "/system-setting/icon",
      name: "SystemSettingIcon",
      meta: {
        title: "Icon管理"
      },
      component: "system-setting/icon/index.vue"
    },

    {
      path: "/system-setting/agreement",
      name: "SystemSettingAgreement",
      meta: {
        title: "协议管理"
      },
      component: "system-setting/agreement/index.vue"
    },

    {
      path: "/system-setting/org-filed",
      name: "SystemSettingOrgFiled",
      meta: {
        title: "组织配置管理"
      },
      component: "system-setting/org-filed/index.vue"
    }
  ]
};

const organizationalStructure = {
  path: "/organizational-structure",
  isFixed: true,
  meta: {
    title: "组织架构",
    icon: "ep:office-building"
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
          auditPendingManagement,
          regionManagement,
          systemUesr,
          systemSetting
        ]
      };
    }
  }
]);
