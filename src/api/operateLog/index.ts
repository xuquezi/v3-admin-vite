import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { OperateLogQuery, OperateLogData } from "./types"
import { ADMIN } from "@/api/servicePort"

export function getOperateLogPage(queryParams: OperateLogQuery): AxiosPromise<PageResult<OperateLogData[]>> {
  return request({
    url: ADMIN + "/operateLog/queryLogByPage",
    method: "get",
    params: queryParams
  })
}

export function delLogByLogId(logId: string) {
  return request({
    url: ADMIN + "/operateLog/delLogByLogId",
    method: "delete",
    params: { logId }
  })
}

export function deleteSelectedLog(data: string[]) {
  return request({
    url: ADMIN + "/operateLog/deleteSelectedLog",
    method: "delete",
    data
  })
}

export function clearLog() {
  return request({
    url: ADMIN + "/operateLog/clearLog",
    method: "delete"
  })
}
