declare global {
  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number
    pageSize: number
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /**
     * 数据列表
     */
    records: T
    /**
     * 数据总数
     */
    total: number
  }
  /**
   * 组件数据源
   */
  interface OptionType {
    /**
     * 值
     */
    id: string
    /**
     * 文本
     */
    label: string
    /**
     * 子列表
     */
    children?: OptionType[]
  }

  interface Window {
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number
  }
}
export {}
