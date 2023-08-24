<template>
  <div>
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" width="900px" append-to-body @close="closeDialog">
      <el-form ref="userFormRef" :model="formData" :rules="userRules" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="用户名字" prop="userRealName">
              <el-input v-model="formData.userRealName" placeholder="请输入用户名字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <el-tree-select node-key="id" v-model="formData.deptId" placeholder="请选择部门" :data="deptList" filterable check-strictly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="formData.userEmail" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="rowShow" label="用户账号" prop="userName">
              <el-input v-model="formData.userName" placeholder="请输入用户名字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="rowShow" label="用户密码" prop="userPassword">
              <el-input v-model="formData.userPassword" placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="userSex">
              <el-select v-model="formData.userSex" placeholder="请选择">
                <el-option v-for="dict in sexOption" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="formData.status">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色" prop="roleIds">
              <el-select v-model="formData.roleIds" multiple placeholder="请选择角色">
                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
import { userRules } from "./validate"
import { DictData } from "@/api/dict/types"
import { UserPageVO, UserForm } from "@/api/user/types"
import { updateUser, addUser } from "@/api/user"
import { queryRoleIdsByUserId } from "@/api/role"
import { RolePageVO } from "@/api/role/types"
import { useThrottleFn } from "@vueuse/core"
const props = defineProps({
  deptList: {
    type: Array<OptionType>,
    default: []
  },
  sexOption: {
    type: Array<DictData>,
    default: []
  },
  statusOptions: {
    type: Array<DictData>,
    default: []
  },
  roleOptions: {
    type: Array<RolePageVO>,
    default: []
  },
  initPassword: {
    type: String,
    default: ""
  }
})
const rowShow = ref(false)
const loading = ref(false)
const formData = reactive<UserForm>({
  userRealName: "",
  status: "0",
  deptId: "",
  userEmail: "",
  userSex: "0",
  userId: "",
  phone: "",
  roleIds: [],
  userName: "",
  userPassword: ""
})
const emit = defineEmits(["refresh"])
const userFormRef = ref(ElForm)
const dialog = reactive({
  isShowDialog: false,
  title: ""
})
// 打开弹窗
const openDialog = () => {
  dialog.isShowDialog = true
}

const initData = (type: string, row: UserPageVO) => {
  resetForm()
  if (type === "edit") {
    rowShow.value = false
    dialog.title = "修改用户"
    Object.assign(formData, row)
    queryRoleIdsByUserId(row.userId).then(({ data }) => {
      formData.roleIds = data
    })
  } else {
    rowShow.value = true
    dialog.title = "新增用户"
    formData.userPassword = props.initPassword
  }
}

/**
 * 关闭弹窗
 */
function closeDialog() {
  dialog.isShowDialog = false
}
/**
 * 重置表单
 */
function resetForm() {
  formData.deptId = ""
  formData.phone = ""
  formData.roleIds = []
  formData.status = "0"
  formData.userEmail = ""
  formData.userId = ""
  formData.userName = ""
  formData.userRealName = ""
  formData.userSex = "0"
}

const handleSubmit = useThrottleFn(() => {
  userFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.userId
      loading.value = true
      if (userId) {
        updateUser(formData)
          .then(() => {
            ElMessage.success("修改用户成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      } else {
        addUser(formData)
          .then(() => {
            ElMessage.success("新增用户成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}, 3000)

defineExpose({
  openDialog,
  initData
})
</script>

<style scoped></style>
