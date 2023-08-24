import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { loginApi, getUserInfoApi, logoutApi } from "@/api/user"
import { LoginRequestData, UserInfoResponseData, UserData } from "@/api/user/types"
import { useStorage } from "@vueuse/core"

export const useUserStore = defineStore("user", () => {
  const token = useStorage("accessToken", "")
  const userId = ref()
  const userRealName = ref("")
  const avatar = ref("")
  const userName = ref("")
  const userEmail = ref("")
  const userSex = ref("")
  const phone = ref("")
  const roles = ref<Array<string>>([]) // 用户角色编码集合 → 判断路由权限
  const perms = ref<Array<string>>([]) // 用户权限编码集合 → 判断按钮权限

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  function updateUserInfo(data: UserData) {
    userRealName.value = data.userRealName
    userEmail.value = data.userEmail
    phone.value = data.phone
    userSex.value = data.userSex
  }

  function login(loginData: LoginRequestData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response) => {
          const data = response.data
          token.value = data
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /** 获取用户详情 */
  const getInfo = async () => {
    return new Promise<UserInfoResponseData>((resolve, reject) => {
      getUserInfoApi()
        .then(({ data }) => {
          if (!data) {
            return reject("Verification failed, please Login again.")
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!")
          }
          userId.value = data.userId
          userRealName.value = data.userRealName
          avatar.value = data.userAvatar
          roles.value = data.roles
          perms.value = data.permissions
          userName.value = data.userName
          userEmail.value = data.userEmail
          phone.value = data.phone
          userSex.value = data.userSex
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetToken()
          location.reload() // 清空路由
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /** 重置 Token */
  const resetToken = () => {
    token.value = ""
    userRealName.value = ""
    avatar.value = ""
    roles.value = []
    perms.value = []
    userName.value = ""
    userEmail.value = ""
    phone.value = ""
    userSex.value = ""
    resetTagsView()
  }
  /** 重置 Visited Views 和 Cached Views */
  const resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, roles, userName, userRealName, userId, userEmail, avatar, userSex, phone, perms, login, getInfo, logout, resetToken, updateUserInfo }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
