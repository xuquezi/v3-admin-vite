import type { FormRules } from "element-plus"
import { reactive } from "vue"

const REGEXP_PHONE = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/

const REGEXP_EMAIl = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/

/** 登录校验 */
const userRules = reactive(<FormRules>{
  userRealName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("用户名字不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  userName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("用户账号不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  userPassword: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("用户密码不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  userEmail: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("用户邮箱不能为空"))
        } else if (!REGEXP_EMAIl.test(value)) {
          callback(new Error("请输入正确的邮箱地址"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("用户手机不能为空"))
        } else if (!REGEXP_PHONE.test(value)) {
          callback(new Error("请输入正确的手机号"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  deptId: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请选择部门"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  roleIds: [
    {
      validator: (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error("请选择角色"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})

export { userRules }
