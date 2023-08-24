<template>
  <div>
    <el-form ref="formRef" :model="user" :rules="rules" label-width="100px">
      <el-form-item label="用户姓名" prop="userRealName">
        <el-input v-model="user.userRealName" />
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input v-model="user.userEmail" maxlength="50" />
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="user.phone" maxlength="50" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="user.userSex">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue"
import { useThrottleFn } from "@vueuse/core"
import { ElMessage, ElForm } from "element-plus"
import { rules } from "./userRules"
import { updateUserProfile } from "@/api/user"
import { UserData } from "@/api/user/types"
import { useUserStoreHook } from "@/store/modules/user"
const userStore = useUserStoreHook()
const props = defineProps({
  user: {
    type: Object as PropType<UserData>,
    default: () => {
      return {
        userId: "",
        avatar: "",
        userEmail: "",
        userRealName: "",
        userSex: "0",
        userName: "",
        phone: ""
      }
    }
  }
})
const formRef = ref(ElForm)
const loading = ref(false)
const submit = useThrottleFn(() => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      updateUserProfile(props.user)
        .then(() => {
          userStore.updateUserInfo(props.user)
          ElMessage.success("修改成功")
        })
        .finally(() => (loading.value = false))
    }
  })
}, 3000)
</script>

<style scoped></style>
