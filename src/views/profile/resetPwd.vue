<template>
  <div>
    <el-form ref="formRef" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core"
import { ElMessage, ElForm } from "element-plus"
import { reactive, ref } from "vue"
import { PasswordForm } from "@/api/user/types"
import { updateUserPassword } from "@/api/user"
import { useUserStoreHook } from "@/store/modules/user"
const user = reactive<PasswordForm>({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
})
const userStore = useUserStoreHook()
const formRef = ref(ElForm)
const loading = ref(false)

const equalToPassword = (rule: any, value: any, callback: any) => {
  if (user.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const rules = reactive({
  oldPassword: [{ required: true, message: "旧密码不能为空", trigger: "blur" }],
  newPassword: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    { required: true, validator: equalToPassword, trigger: "blur" }
  ]
})

const submit = useThrottleFn(() => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      updateUserPassword(userStore.userId, user.oldPassword, user.newPassword)
        .then(() => {
          resetForm()
          ElMessage.success("修改成功")
        })
        .finally(() => (loading.value = false))
    }
  })
}, 3000)

function resetForm() {
  user.oldPassword = ""
  user.confirmPassword = ""
  user.newPassword = ""
}
</script>

<style scoped></style>
