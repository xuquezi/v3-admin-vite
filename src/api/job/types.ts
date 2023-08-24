export interface JobQuery extends PageQuery {
  jobName?: string
}

export interface JobData {
  jobId: string
  jobName: string
  invokeTarget: string
  invokeMethod: string
  invokeParam: string
  cronExpression: string
  misfirePolicy: string
  concurrent: string
  status: string
  saveLog: string
}

export interface JobForm {
  jobId: string
  jobName: string
  invokeTarget: string
  invokeMethod: string
  invokeParam: string
  cronExpression: string
  misfirePolicy: string
  concurrent: string
  status: string
  saveLog: string
}
