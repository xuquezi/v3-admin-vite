import type { FormRules } from "element-plus"
import { reactive } from "vue"

const roleRules = reactive(<FormRules>{
  roleName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("角色名称不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  roleKey: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("角色编码不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  dataScope: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请选择数据权限"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})

export { roleRules }
