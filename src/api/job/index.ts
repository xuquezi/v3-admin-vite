import request from "@/utils/service"
import { AxiosPromise } from "axios"
import { JobData, JobQuery, JobForm } from "./types"
import { JOB } from "@/api/servicePort"

export function getJobPage(queryParams: JobQuery): AxiosPromise<PageResult<JobData[]>> {
  return request({
    url: JOB + "/job/queryJobByPage",
    method: "get",
    params: queryParams
  })
}

export function changeJobStatus(jobId: string, jobStatus: string) {
  return request({
    url: JOB + "/job/changeStatus",
    method: "put",
    params: { jobId, jobStatus }
  })
}

export function delJobById(jobId: string) {
  return request({
    url: JOB + "/job/delJobById",
    method: "delete",
    params: { jobId }
  })
}

export function addJob(data: JobForm) {
  return request({
    url: JOB + "/job/createJob",
    method: "post",
    data: data
  })
}

export function updateJob(data: JobForm) {
  return request({
    url: JOB + "/job/updateJob",
    method: "put",
    data: data
  })
}

export function runJob(jobId: string) {
  return request({
    url: JOB + "/job/run",
    method: "get",
    params: { jobId }
  })
}
