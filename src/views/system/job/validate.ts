import type { FormRules } from "element-plus"
import { reactive } from "vue"

const jobRules = reactive(<FormRules>{
  jobName: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("任务名称不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  invokeTarget: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("目标类不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  invokeMethod: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("目标方法不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ],
  cronExpression: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("cron表达式不能为空"))
        } else {
          callback()
        }
      },
      trigger: "blur"
    }
  ]
})

export { jobRules }
