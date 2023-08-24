import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { DeptQuery, DeptData, DeptForm } from "./types"
import { ADMIN } from "@/api/servicePort"

/**
 * 部门下拉列表
 */
export function getDepartTreeSelect(): AxiosPromise<OptionType[]> {
  return request({
    url: ADMIN + "/dept/getDepartTreeSelect",
    method: "get"
  })
}

/**
 * 获取部门树形列表
 *
 * @param queryParams
 */
export function getDeptList(queryParams: DeptQuery): AxiosPromise<DeptData[]> {
  return request({
    url: ADMIN + "/dept/queryDeptList",
    method: "get",
    params: queryParams
  })
}

/**
 * 添加部门
 */
export function addDept(data: DeptForm) {
  return request({
    url: ADMIN + "/dept/addDept",
    method: "post",
    data: data
  })
}

/**
 * 修改部门
 */
export function updateDept(data: DeptForm) {
  return request({
    url: ADMIN + "/dept/updateDept",
    method: "put",
    data: data
  })
}

export function delDeptById(deptId: string) {
  return request({
    url: ADMIN + "/dept/delDeptById",
    method: "delete",
    params: { deptId }
  })
}
