export interface OperateLogQuery extends PageQuery {
  username?: string
}

export interface OperateLogData {
  logId: string
  executionTime: number
  ip: string
  method: string
  url: string
  username: string
  visitTime: string
}
