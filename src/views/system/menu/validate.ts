import type { FormRules } from "element-plus"
import { reactive } from "vue"

const menuRules = reactive(<FormRules>{
  menuName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("菜单名称不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  menuPath: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("路由路径不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  menuComponent: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("页面路径不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  menuPerms: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("权限标识不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  menuIcon: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("图标不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})

export { menuRules }
