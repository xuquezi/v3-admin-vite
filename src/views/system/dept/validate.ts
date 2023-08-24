import type { FormRules } from "element-plus"
import { reactive } from "vue"

const deptRules = reactive(<FormRules>{
  deptName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("部门名称不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})

export { deptRules }
