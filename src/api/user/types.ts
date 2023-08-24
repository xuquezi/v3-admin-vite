export interface LoginRequestData {
  username: string
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
  /**
   * 验证码缓存key
   */
  key?: string
}

export interface LoginCodeResponseData {
  /**
   * 验证码缓存key
   */
  key: string
  /**
   * 验证码图片Base64字符串
   */
  img: string
}

export interface UserInfoResponseData {
  userId: string
  userRealName: string
  userName: string
  userEmail: string
  userAvatar: string
  userSex: string
  phone: string
  roles: string[]
  roleIds: string[]
  permissions: string[]
}

export interface UserData {
  userId: string
  userName: string
  userEmail: string
  avatar: string
  userSex: string
  userRealName: string
  phone: string
}

export interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * 用户查询对象类型
 */
export interface UserQuery extends PageQuery {
  userName?: string
  deptId?: string
}

/**
 * 用户分页对象
 */
export interface UserPageVO {
  /**
   * 用户id
   */
  userId: string
  /**
   * 部门id
   */
  deptId: string
  /**
   * 用户账号
   */
  userName: string
  /**
   * 用户名字
   */
  userRealName: string
  /**
   * 邮箱
   */
  userEmail: string
  /**
   * 性别
   */
  userSex: string
  /**
   * 头像
   */
  userAvatar: string
  /**
   * 电话
   */
  phone: string
  /**
   * 状态
   */
  status: string
}

/**
 * 用户表单类型
 */
export interface UserForm {
  /**
   * 部门ID
   */
  deptId?: string
  /**
   * 邮箱
   */
  userEmail?: string
  /**
   * 性别
   */
  userSex?: string
  /**
   * 用户ID
   */
  userId?: string
  /**
   * 电话
   */
  phone?: string
  /**
   * 用户名字
   */
  userRealName?: string
  /**
   * 角色ID集合
   */
  roleIds?: string[]
  /**
   * 用户状态
   */
  status?: string
  /**
   * 用户名
   */
  userName?: string
  /**
   * 用户密码
   */
  userPassword: string
}
