import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage, ElMessageBox } from "element-plus"
import { HttpStatusEnum } from "@/enums/HttpStatusEnum"
import router from "@/router"

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" }
})

const reLogin = { show: false }

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStoreHook()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data
    if (code !== HttpStatusEnum.SUCCESS) {
      if (code === HttpStatusEnum.UNAUTHORIZED) {
        if (!reLogin.show) {
          reLogin.show = true
          ElMessageBox.confirm("登录状态已过期, 请重新登录！", "系统提示", {
            confirmButtonText: "重新登录",
            showCancelButton: false,
            closeOnClickModal: false,
            type: "warning"
          })
            .then(() => {
              reLogin.show = false
              localStorage.clear()
              window.location.href = "/"
            })
            .catch(() => {
              reLogin.show = false
            })
        }
      } else if (code === HttpStatusEnum.NO_PERMISSION) {
        // 新增权限不足页面
        reLogin.show = false
        router.push({ path: "/403", params: { message: message } })
      } else {
        ElMessage({
          message: message || "Error",
          type: "error",
          duration: 2 * 1000
        })
      }
      return Promise.reject(new Error(message || "Error"))
    } else {
      return response.data
    }
  },
  (error: AxiosError) => {
    ElMessage({
      message: error.message,
      type: "error",
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

// 导出 axios 实例
export default service
