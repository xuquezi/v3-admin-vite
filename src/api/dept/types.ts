export interface DeptQuery extends PageQuery {
  deptName?: string
}

export interface DeptData {
  deptId: string
  parentId: string
  deptName: string
  orderNum: number
  /**
   * 子部门
   */
  children: DeptData[]
}

export interface DeptForm {
  deptId: string
  parentId: string
  deptName: string
  orderNum: number
}
