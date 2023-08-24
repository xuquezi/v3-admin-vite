import type { FormRules } from "element-plus"
import { reactive } from "vue"

const configRules = reactive(<FormRules>{
  configName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("配置名称不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  configKey: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("配置key不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  configValue: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("配置值不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})

export { configRules }
