// 回显数据字典
export interface DictData {
  dictLabel: string
  dictValue: string
  dictName: string
  dictType: string
  dictCode: string
}

export interface DictQuery extends PageQuery {
  dictName?: string
}

export interface DictForm {
  /**
   * 字典code
   */
  dictCode: string

  /**
   * 字典label
   */
  dictLabel: string

  /**
   * 字典值
   */
  dictValue: string
  /**
   * 字典名称
   */
  dictName: string
  /**
   * 字典类型
   */
  dictType: string
}
