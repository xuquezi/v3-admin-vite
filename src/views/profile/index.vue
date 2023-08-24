<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <template #header>
            <span>个人信息</span>
          </template>
          <div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon name="user" />用户姓名
                <div class="pull-right">{{ user.userRealName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon name="user" />登录账号
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon name="publish" />用户邮箱
                <div class="pull-right">{{ user.userEmail }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon name="publish" />用户手机
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon name="peoples" />拥有角色
                <div class="pull-right">{{ roleKeys }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <template #header>
            <span>用户资料</span>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <UserInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <ResetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"
import { useUserStoreHook } from "@/store/modules/user"
import UserInfo from "@/views/profile/userInfo.vue"
import ResetPwd from "@/views/profile/resetPwd.vue"
import { UserData } from "@/api/user/types"

const roleKeys = ref("")
const userStore = useUserStoreHook()
const activeTab = ref("userinfo")
const user = reactive<UserData>({
  userId: "",
  userName: "",
  userEmail: "",
  avatar: "",
  userSex: "",
  userRealName: "",
  phone: ""
})

function initUser() {
  user.userId = userStore.userId
  user.userName = userStore.userName
  user.userEmail = userStore.userEmail
  user.avatar = userStore.avatar
  user.userSex = userStore.userSex
  user.userRealName = userStore.userRealName
  user.phone = userStore.phone
  roleKeys.value = userStore.roles.join(" | ")
}

onMounted(() => {
  initUser()
})
</script>

<style lang="scss" scoped>
@import "@/styles/profile";
</style>
