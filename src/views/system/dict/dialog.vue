<template>
  <div>
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" width="800px" @close="closeDialog">
      <el-form ref="dictFormRef" :model="formData" :rules="dictRules" label-width="100px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="formData.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="字典内容" prop="dictLabel">
          <el-input v-model="formData.dictLabel" placeholder="请输入字典内容" />
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="formData.dictValue" placeholder="请输入字典值" />
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
import { useThrottleFn } from "@vueuse/core"
import { DictForm, DictData } from "@/api/dict/types"
import { updateDict, addDict } from "@/api/dict"
import { dictRules } from "./validate"
const dialog = reactive({
  isShowDialog: false,
  title: ""
})
const emit = defineEmits(["refresh"])
const dictFormRef = ref(ElForm)
const loading = ref(false)
const formData = reactive<DictForm>({
  dictCode: "",
  dictLabel: "",
  dictName: "",
  dictType: "",
  dictValue: ""
})

const handleSubmit = useThrottleFn(() => {
  dictFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const dictCode = formData.dictCode
      loading.value = true
      if (dictCode) {
        updateDict(formData)
          .then(() => {
            ElMessage.success("修改字典项成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      } else {
        addDict(formData)
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
  formData.dictCode = ""
  formData.dictLabel = ""
  formData.dictName = ""
  formData.dictType = ""
  formData.dictValue = ""
}

function openDialog(type: string, row: DictData) {
  resetForm()
  if (type === "edit") {
    dialog.title = "修改字典"
    Object.assign(formData, row)
  } else {
    dialog.title = "新增字典"
  }
  dialog.isShowDialog = true
}
defineExpose({
  openDialog
})
</script>

<style scoped></style>
