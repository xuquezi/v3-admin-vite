import request from "@/utils/service"
import { LoginRequestData, LoginCodeResponseData, UserInfoResponseData, UserQuery, UserPageVO, UserForm, UserData } from "./types"
import { AxiosPromise } from "axios"
import { ADMIN } from "@/api/servicePort"

/** 获取登录验证码 */
export function getLoginCodeApi(): AxiosPromise<LoginCodeResponseData> {
  return request({
    url: ADMIN + "/user/captcha",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: LoginRequestData): AxiosPromise<string> {
  return request({
    url: ADMIN + "/user/login",
    method: "post",
    data
  })
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: ADMIN + "/user/logout",
    method: "get"
  })
}

/** 获取用户详情 */
export function getUserInfoApi(): AxiosPromise<UserInfoResponseData> {
  return request({
    url: ADMIN + "/user/queryUserInfo",
    method: "get"
  })
}

/**
 * 获取用户分页列表
 */
export function getUserPage(queryParams: UserQuery): AxiosPromise<PageResult<UserPageVO[]>> {
  return request({
    url: ADMIN + "/user/page",
    method: "get",
    params: queryParams
  })
}

/**
 * 修改用户状态
 */
export function changeUserStatus(userId: string, userStatus: string) {
  return request({
    url: ADMIN + "/user/changeUserStatus",
    method: "put",
    params: { userId, userStatus }
  })
}

/**
 * 删除用户
 */
export function delUserByUserId(userId: string) {
  return request({
    url: ADMIN + "/user/delete",
    method: "delete",
    params: { userId }
  })
}

/**
 * 修改用户密码
 */
export function resetUserPassword(userId: string, userPassword: string) {
  return request({
    url: ADMIN + "/user/resetPassword",
    method: "put",
    params: { userId, userPassword }
  })
}

/**
 * 添加用户
 */
export function addUser(data: UserForm) {
  return request({
    url: ADMIN + "/user/createUser",
    method: "post",
    data: data
  })
}

/**
 * 修改用户
 */
export function updateUser(data: UserForm) {
  return request({
    url: ADMIN + "/user/updateUser",
    method: "put",
    data: data
  })
}

export function updateUserProfile(data: UserData) {
  return request({
    url: ADMIN + "/user/updateUserProfile",
    method: "put",
    data: data
  })
}

export function updateUserPassword(userId: string, oldPassword: string, newPassword: string) {
  return request({
    url: ADMIN + "/user/updateUserPassword",
    method: "put",
    params: { userId, oldPassword, newPassword }
  })
}
