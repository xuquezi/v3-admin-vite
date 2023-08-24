import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { ConfigData, ConfigQuery, ConfigForm } from "./types"
import { ADMIN } from "@/api/servicePort"

export function getConfigByKey(configKey: string): AxiosPromise<string> {
  return request({
    url: ADMIN + "/config/getConfigByKey/" + configKey,
    method: "get"
  })
}

export function getConfigPage(queryParams: ConfigQuery): AxiosPromise<PageResult<ConfigData[]>> {
  return request({
    url: ADMIN + "/config/queryConfigByPage",
    method: "get",
    params: queryParams
  })
}

export function delConfigById(configId: string) {
  return request({
    url: ADMIN + "/config/delConfigById",
    method: "delete",
    params: { configId }
  })
}

/**
 * 添加配置
 */
export function addConfig(data: ConfigForm) {
  return request({
    url: ADMIN + "/config/createConfig",
    method: "post",
    data: data
  })
}

/**
 * 修改配置
 */
export function updateConfig(data: ConfigForm) {
  return request({
    url: ADMIN + "/config/updateConfig",
    method: "put",
    data: data
  })
}
