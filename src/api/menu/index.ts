import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { MenuData, MenuQuery, MenuForm } from "./types"
import { ADMIN } from "@/api/servicePort"

/**
 * 获取路由列表
 */
export function queryMenusByRoleIds(data: string[]) {
  return request({
    url: ADMIN + "/menu/queryMenusByRoleIds",
    method: "post",
    data
  })
}

/**
 * 菜单下拉列表
 */
export function getMenuTreeSelect(): AxiosPromise<OptionType[]> {
  return request({
    url: ADMIN + "/menu/menuTreeSelect",
    method: "get"
  })
}

/**
 * 获取角色配置菜单
 */
export function getRoleMenuCheckedIds(roleId: string): AxiosPromise<string[]> {
  return request({
    url: ADMIN + "/menu/getRoleMenuCheckedIds",
    method: "get",
    params: { roleId }
  })
}

/**
 * 获取菜单树形列表
 *
 * @param queryParams
 */
export function getMenuList(queryParams: MenuQuery): AxiosPromise<MenuData[]> {
  return request({
    url: ADMIN + "/menu/queryMenus",
    method: "get",
    params: queryParams
  })
}

/**
 * 添加菜单
 */
export function addMenu(data: MenuForm) {
  return request({
    url: ADMIN + "/menu/addMenu",
    method: "post",
    data: data
  })
}

/**
 * 修改菜单
 */
export function updateMenu(data: MenuForm) {
  return request({
    url: ADMIN + "/menu/updateMenu",
    method: "put",
    data: data
  })
}

/**
 * 删除字典项
 */
export function delMenuByMenuId(menuId: string) {
  return request({
    url: ADMIN + "/menu/delMenuByMenuId",
    method: "delete",
    params: { menuId }
  })
}
