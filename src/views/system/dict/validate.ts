import type { FormRules } from "element-plus"
import { reactive } from "vue"

const dictRules = reactive(<FormRules>{
  dictType: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("字典类型不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  dictName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("字典名称不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  dictLabel: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("字典内容不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  dictValue: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("字典值不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})

export { dictRules }
