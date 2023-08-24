export interface JobLogQuery extends PageQuery {
  jobName?: string
}

export interface JobLogData {
  jobLogId: string
  jobName: string
  invokeTarget: string
  invokeMethod: string
  invokeParam: string
  jobMessage: string
  status: string
  exceptionInfo: string
  startTime: string
  endTime: string
}
