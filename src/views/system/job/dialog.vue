<template>
  <div>
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" width="800px" @close="closeDialog">
      <el-form ref="jobFormRef" :model="formData" :rules="jobRules" label-width="100px">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="formData.jobName" placeholder="任务名称" />
        </el-form-item>
        <el-form-item label="目标类" prop="invokeTarget">
          <el-input v-model="formData.invokeTarget" placeholder="目标类" />
        </el-form-item>
        <el-form-item label="目标方法" prop="invokeMethod">
          <el-input v-model="formData.invokeMethod" placeholder="目标方法" />
        </el-form-item>
        <el-form-item label="目标参数" prop="invokeParam">
          <el-input v-model="formData.invokeParam" placeholder="目标参数" />
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input v-model="formData.cronExpression" placeholder="目标参数" />
        </el-form-item>
        <el-form-item label="错误策略" prop="misfirePolicy">
          <el-radio-group v-model="formData.misfirePolicy">
            <el-radio v-for="dict in policyOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否并发" prop="concurrent">
          <el-radio-group v-model="formData.concurrent">
            <el-radio v-for="dict in concurrentOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否保存日志" prop="saveLog">
          <el-radio-group v-model="formData.saveLog">
            <el-radio v-for="dict in saveLogOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
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
import { jobRules } from "./validate"
import { JobData, JobForm } from "@/api/job/types"
import { updateJob, addJob } from "@/api/job"
import { DictData } from "@/api/dict/types"
import { useThrottleFn } from "@vueuse/core"
defineProps({
  statusOptions: {
    type: Array<DictData>,
    default: []
  },
  policyOptions: {
    type: Array<DictData>,
    default: []
  },
  concurrentOptions: {
    type: Array<DictData>,
    default: []
  },
  saveLogOptions: {
    type: Array<DictData>,
    default: []
  }
})
const jobFormRef = ref(ElForm)
const loading = ref(false)
const dialog = reactive({
  isShowDialog: false,
  title: ""
})
const emit = defineEmits(["refresh"])
function closeDialog() {
  dialog.isShowDialog = false
}
const formData = reactive<JobForm>({
  jobId: "",
  jobName: "",
  invokeTarget: "",
  invokeMethod: "",
  invokeParam: "",
  cronExpression: "",
  misfirePolicy: "1",
  concurrent: "0",
  status: "0",
  saveLog: "1"
})

function resetForm() {
  formData.jobId = ""
  formData.jobName = ""
  formData.invokeTarget = ""
  formData.invokeMethod = ""
  formData.invokeParam = ""
  formData.cronExpression = ""
  formData.misfirePolicy = "1"
  formData.concurrent = "0"
  formData.status = "0"
  formData.saveLog = "1"
}

const handleSubmit = useThrottleFn(() => {
  jobFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const jobId = formData.jobId
      loading.value = true
      if (jobId) {
        updateJob(formData)
          .then(() => {
            ElMessage.success("修改定时任务成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      } else {
        addJob(formData)
          .then(() => {
            ElMessage.success("新增定时任务成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}, 3000)

function openDialog(type: string, row: JobData) {
  resetForm()
  if (type === "edit") {
    dialog.title = "修改定时任务"
    Object.assign(formData, row)
  } else {
    dialog.title = "新增定时任务"
  }
  dialog.isShowDialog = true
}
defineExpose({
  openDialog
})
</script>

<style scoped></style>
