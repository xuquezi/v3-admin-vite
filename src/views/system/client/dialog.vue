<template>
  <div>
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" width="800px" @close="closeDialog">
      <el-form ref="clientFormRef" :model="formData" :rules="clientRules" label-width="100px">
        <el-form-item label="客户端名称" prop="clientName">
          <el-input v-model="formData.clientName" placeholder="客户端名称" />
        </el-form-item>
        <el-form-item label="客户端Key" prop="clientKey">
          <el-input v-model="formData.clientKey" placeholder="客户端Key" />
        </el-form-item>
        <el-form-item label="客户端Secret" prop="clientSecret">
          <el-input v-model="formData.clientSecret" placeholder="客户端Secret" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { useThrottleFn } from "@vueuse/core"
import { ElMessage, ElForm } from "element-plus"
import { ClientForm, ClientData } from "@/api/client/types"
import { updateClient, addClient } from "@/api/client"
import { clientRules } from "./validate"
const dialog = reactive({
  isShowDialog: false,
  title: ""
})
const emit = defineEmits(["refresh"])
const loading = ref(false)
const clientFormRef = ref(ElForm)
const formData = reactive<ClientForm>({
  clientId: "",
  clientKey: "",
  clientName: "",
  clientSecret: ""
})

function closeDialog() {
  dialog.isShowDialog = false
}

function resetForm() {
  formData.clientId = ""
  formData.clientKey = ""
  formData.clientName = ""
  formData.clientSecret = ""
}

const handleSubmit = useThrottleFn(() => {
  clientFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const clientId = formData.clientId
      loading.value = true
      if (clientId) {
        updateClient(formData)
          .then(() => {
            ElMessage.success("修改客户端成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      } else {
        addClient(formData)
          .then(() => {
            ElMessage.success("新增客户端成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}, 3000)

function openDialog(type: string, row: ClientData) {
  resetForm()
  if (type === "edit") {
    dialog.title = "修改客户端"
    Object.assign(formData, row)
  } else {
    dialog.title = "新增客户端"
  }
  dialog.isShowDialog = true
}
defineExpose({
  openDialog
})
</script>

<style scoped></style>
