export interface MenuQuery extends PageQuery {
  menuName?: string
}

/**
 * 菜单数据
 */
export interface MenuData {
  /**
   * 子菜单
   */
  children: MenuData[]
  /**
   * 组件路径
   */
  menuComponent: string
  /**
   * ICON
   */
  menuIcon: string
  /**
   * 菜单ID
   */
  menuId: string
  /**
   * 菜单名称
   */
  menuName: string
  /**
   * 父菜单ID
   */
  menuParentId: string
  /**
   * 按钮权限标识
   */
  menuPerms: string
  /**
   * 跳转路径
   */
  redirect: string
  /**
   * 菜单排序
   */
  menuOrderNum: number
  /**
   * 菜单类型
   */
  menuType: string
  /**
   * 菜单是否可见
   */
  menuVisible: string
  /**
   * 路由路径
   */
  menuPath: string
}

/**
 * 菜单表单对象类型
 */
export interface MenuForm {
  /**
   * 菜单ID
   */
  menuId?: string
  /**
   * 父菜单ID
   */
  menuParentId?: string
  /**
   * 菜单名称
   */
  menuName?: string
  /**
   * 菜单是否可见
   */
  menuVisible: string
  /**
   * 菜单图标
   */
  menuIcon?: string
  /**
   * 排序
   */
  menuOrderNum: number
  /**
   * 组件路径
   */
  menuComponent?: string
  /**
   * 路由路径
   */
  menuPath?: string
  /**
   * 跳转路由路径
   */
  redirect?: string

  /**
   * 菜单类型
   */
  menuType: string

  /**
   * 权限标识
   */
  menuPerms?: string
}
