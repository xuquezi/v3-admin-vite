import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { RouteRecordRaw } from "vue-router"
import { constantRoutes } from "@/router"
import { queryMenusByRoleIds } from "@/api/menu"
const modules = import.meta.glob("../../views/**/**.vue")
const Layout = () => import("@/layouts/index.vue")
const ParentView = () => import("@/components/ParentView/index.vue")

const filterAsyncRoutes = (routes: RouteRecordRaw[]) => {
  const asyncRoutes: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tmpRoute = { ...route } // ES6扩展运算符复制新对象
    if (tmpRoute.component?.toString() == "Layout") {
      tmpRoute.component = Layout
    } else if (tmpRoute.component?.toString() === "ParentView") {
      tmpRoute.component = ParentView
    } else {
      const component = modules[`../../views/${tmpRoute.component}.vue`]
      if (component) {
        tmpRoute.component = component
      }
    }

    if (tmpRoute.children) {
      tmpRoute.children = filterAsyncRoutes(tmpRoute.children)
    }

    asyncRoutes.push(tmpRoute)
  })
  return asyncRoutes
}

export const usePermissionStore = defineStore("permission", () => {
  // state
  const routes = ref<RouteRecordRaw[]>([])

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes)
  }
  /**
   * 生成动态路由
   *
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roleIds: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有路由
      queryMenusByRoleIds(roleIds)
        .then(({ data: asyncRoutes }) => {
          // 根据角色获取有访问权限的路由
          const accessedRoutes = filterAsyncRoutes(asyncRoutes)
          setRoutes(accessedRoutes)
          resolve(accessedRoutes)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  return { routes, setRoutes, generateRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
