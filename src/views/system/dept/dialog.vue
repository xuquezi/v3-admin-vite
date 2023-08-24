<template>
  <div>
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" width="800px" @closed="closeDialog">
      <el-form ref="deptFormRef" :model="formData" :rules="deptRules" label-width="80px">
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select node-key="id" v-model="formData.parentId" placeholder="选择上级部门" :data="deptOptions" filterable check-strictly :render-after-expand="false" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="formData.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="formData.orderNum" controls-position="right" style="width: 100px" :min="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
          <el-button @click="closeDialog"> 取 消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElForm, ElMessage } from "element-plus"
import { DeptForm, DeptData } from "@/api/dept/types"
import { updateDept, addDept } from "@/api/dept"
import { deptRules } from "./validate"
import { useThrottleFn } from "@vueuse/core"
defineProps({
  deptOptions: {
    type: Array<OptionType>,
    default: []
  }
})
const deptFormRef = ref(ElForm)
const loading = ref(false)
const emit = defineEmits(["refresh"])
const dialog = reactive({
  isShowDialog: false,
  title: ""
})
const formData = reactive<DeptForm>({
  parentId: "0",
  deptId: "",
  deptName: "",
  orderNum: 0
})

function closeDialog() {
  dialog.isShowDialog = false
}

const handleSubmit = useThrottleFn(() => {
  deptFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const deptId = formData.deptId
      loading.value = true
      if (deptId) {
        updateDept(formData)
          .then(() => {
            ElMessage.success("修改成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      } else {
        addDept(formData)
          .then(() => {
            ElMessage.success("新增成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}, 3000)

function resetForm() {
  ;(formData.deptId = ""), (formData.parentId = "0"), (formData.orderNum = 0), (formData.deptName = "")
}

function openDialog(type: string, parentId: string, row: DeptData) {
  resetForm()
  if (type === "edit") {
    dialog.title = "修改部门"
    Object.assign(formData, row)
  } else {
    dialog.title = "新增部门"
    formData.parentId = parentId
  }
  dialog.isShowDialog = true
}

defineExpose({
  openDialog
})
</script>

<style scoped></style>
