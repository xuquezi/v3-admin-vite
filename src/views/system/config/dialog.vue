<template>
  <div>
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" width="800px" @close="closeDialog">
      <el-form ref="configFormRef" :model="formData" :rules="configRules" label-width="100px">
        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="formData.configName" placeholder="配置名称" />
        </el-form-item>
        <el-form-item label="配置key" prop="configKey">
          <el-input v-model="formData.configKey" placeholder="配置key" />
        </el-form-item>
        <el-form-item label="配置值" prop="configValue">
          <el-input v-model="formData.configValue" placeholder="配置值" />
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
import { ElForm, ElMessage } from "element-plus"
import { ConfigForm, ConfigData } from "@/api/config/types"
import { configRules } from "./validate"
import { updateConfig, addConfig } from "@/api/config"
import { useThrottleFn } from "@vueuse/core"
const dialog = reactive({
  isShowDialog: false,
  title: ""
})
const configFormRef = ref(ElForm)
const emit = defineEmits(["refresh"])
const formData = reactive<ConfigForm>({
  configId: "",
  configKey: "",
  configName: "",
  configValue: ""
})
const loading = ref(false)
const handleSubmit = useThrottleFn(() => {
  configFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const configId = formData.configId
      loading.value = true
      if (configId) {
        updateConfig(formData)
          .then(() => {
            ElMessage.success("修改字典项成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      } else {
        addConfig(formData)
          .then(() => {
            ElMessage.success("新增字典项成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}, 3000)

function closeDialog() {
  dialog.isShowDialog = false
}

function resetForm() {
  formData.configId = ""
  formData.configKey = ""
  formData.configName = ""
  formData.configValue = ""
}

function openDialog(type: string, row: ConfigData) {
  resetForm()
  if (type === "edit") {
    dialog.title = "修改配置"
    Object.assign(formData, row)
  } else {
    dialog.title = "新增配置"
  }
  dialog.isShowDialog = true
}
defineExpose({
  openDialog
})
</script>

<style scoped></style>
