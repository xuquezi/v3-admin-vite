import type { FormRules } from "element-plus"
import { reactive } from "vue"

const clientRules = reactive(<FormRules>{
  clientName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("客户端名称不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  clientKey: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("客户端Key不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  clientSecret: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("客户端Secret不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})

export { clientRules }
