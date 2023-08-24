/**
 * 用户分页对象
 */
export interface RolePageVO {
  /**
   * 角色id
   */
  roleId: string
  /**
   * 角色名称
   */
  roleName: string
  /**
   * 角色key
   */
  roleKey: string
  /**
   * 状态
   */
  status: string
  /**
   * 数据权限
   */
  dataScope: string
}

export interface RoleQuery extends PageQuery {
  roleName?: string
}

export interface RoleForm {
  /**
   * 角色ID
   */
  roleId: string

  /**
   * 角色编码
   */
  roleKey: string

  /**
   * 角色名称
   */
  roleName: string
  /**
   * 角色状态
   */
  status: string
  /**
   * 数据权限
   */
  dataScope: string
}
