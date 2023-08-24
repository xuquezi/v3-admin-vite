import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { RolePageVO, RoleQuery, RoleForm } from "./types"
import { ADMIN } from "@/api/servicePort"

export function queryAllRoles(): AxiosPromise<RolePageVO[]> {
  return request({
    url: ADMIN + "/role/queryAllRoles",
    method: "get"
  })
}

export function queryRoleIdsByUserId(userId: string): AxiosPromise<string[]> {
  return request({
    url: ADMIN + "/role/queryRoleIdsByUserId",
    method: "get",
    params: { userId }
  })
}

/**
 * 获取角色分页列表
 */
export function getRolePage(queryParams: RoleQuery): AxiosPromise<PageResult<RolePageVO[]>> {
  return request({
    url: ADMIN + "/role/page",
    method: "get",
    params: queryParams
  })
}

/**
 * 删除用户
 */
export function delRoleByRoleId(roleId: string) {
  return request({
    url: ADMIN + "/role/delete",
    method: "delete",
    params: { roleId }
  })
}

/**
 * 修改角色状态
 */
export function changeRoleStatus(roleId: string, roleStatus: string) {
  return request({
    url: ADMIN + "/role/changeRoleStatus",
    method: "put",
    params: { roleId, roleStatus }
  })
}

/**
 * 添加角色
 */
export function addRole(data: RoleForm) {
  return request({
    url: ADMIN + "/role/addRole",
    method: "post",
    data: data
  })
}

/**
 * 修改角色
 */
export function updateRole(data: RoleForm) {
  return request({
    url: ADMIN + "/role/updateRole",
    method: "put",
    data: data
  })
}

export function updateRoleMenus(roleId: string, menuIds: string[]) {
  return request({
    url: ADMIN + "/role/updateRoleMenus",
    method: "put",
    data: { roleId, menuIds }
  })
}
