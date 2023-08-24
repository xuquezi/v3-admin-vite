import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { DictData, DictQuery, DictForm } from "./types"
import { ADMIN } from "@/api/servicePort"

export function getDict(dictType: string): AxiosPromise<DictData[]> {
  return request({
    url: ADMIN + "/dict/getDict/" + dictType,
    method: "get"
  })
}

export function selectDictLabel(datas: Array<DictData>, value: string) {
  const actions: string[] = []
  datas.forEach((item) => {
    if (item.dictValue === "" + value) {
      actions.push(item.dictLabel)
      return true
    }
  })
  return actions.join("")
}

/**
 * 获取字典分页列表
 */
export function getDictPage(queryParams: DictQuery): AxiosPromise<PageResult<DictData[]>> {
  return request({
    url: ADMIN + "/dict/queryDictByPage",
    method: "get",
    params: queryParams
  })
}

/**
 * 删除字典项
 */
export function delDictByDictCode(dictCode: string) {
  return request({
    url: ADMIN + "/dict/delDictByDictCode",
    method: "delete",
    params: { dictCode }
  })
}

/**
 * 添加字典项
 */
export function addDict(data: DictForm) {
  return request({
    url: ADMIN + "/dict/createDict",
    method: "post",
    data: data
  })
}

/**
 * 修改字典项
 */
export function updateDict(data: DictForm) {
  return request({
    url: ADMIN + "/dict/updateDict",
    method: "put",
    data: data
  })
}
