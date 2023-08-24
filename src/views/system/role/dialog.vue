<template>
  <div>
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" width="800px" @close="closeDialog">
      <el-form ref="roleFormRef" :model="formData" :rules="roleRules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色编码" prop="roleKey">
          <el-input v-model="formData.roleKey" placeholder="请输入角色编码" />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据权限" prop="dataScope">
          <el-select v-model="formData.dataScope" placeholder="请数据权限">
            <el-option v-for="item in dataScopeOptions" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
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
import { RolePageVO, RoleForm } from "@/api/role/types"
import { roleRules } from "./validate"
import { DictData } from "@/api/dict/types"
import { updateRole, addRole } from "@/api/role"
defineProps({
  statusOptions: {
    type: Array<DictData>,
    default: []
  },
  dataScopeOptions: {
    type: Array<DictData>,
    default: []
  }
})
const emit = defineEmits(["refresh"])
const loading = ref(false)
const roleFormRef = ref(ElForm)
const dialog = reactive({
  isShowDialog: false,
  title: ""
})
const formData = reactive<RoleForm>({
  roleId: "",
  status: "0",
  roleName: "",
  roleKey: "",
  dataScope: "3"
})

const openDialog = (type: string, row: RolePageVO) => {
  resetForm()
  if (type === "edit") {
    dialog.title = "修改角色"
    Object.assign(formData, row)
  } else {
    dialog.title = "新增角色"
  }
  dialog.isShowDialog = true
}

/**
 * 重置表单
 */
function resetForm() {
  formData.roleId = ""
  formData.roleName = ""
  formData.roleKey = ""
  formData.status = "0"
  formData.dataScope = "3"
}

function closeDialog() {
  dialog.isShowDialog = false
}

const handleSubmit = useThrottleFn(() => {
  roleFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.roleId
      loading.value = true
      if (userId) {
        updateRole(formData)
          .then(() => {
            ElMessage.success("修改角色成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      } else {
        addRole(formData)
          .then(() => {
            ElMessage.success("新增角色成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}, 3000)

defineExpose({
  openDialog
})
</script>

<style scoped></style>
