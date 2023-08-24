import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { JobLogQuery, JobLogData } from "./types"
import { JOB } from "@/api/servicePort"

export function queryJobLogByPage(queryParams: JobLogQuery): AxiosPromise<PageResult<JobLogData[]>> {
  return request({
    url: JOB + "/jobLog/queryJobLogByPage",
    method: "get",
    params: queryParams
  })
}

export function delLogByLogId(jobLogId: string) {
  return request({
    url: JOB + "/jobLog/delLogByLogId",
    method: "delete",
    params: { jobLogId }
  })
}

export function deleteSelectedLog(data: string[]) {
  return request({
    url: JOB + "/jobLog/deleteSelectedLog",
    method: "delete",
    data
  })
}

export function clearLog() {
  return request({
    url: JOB + "/jobLog/clearLog",
    method: "delete"
  })
}
