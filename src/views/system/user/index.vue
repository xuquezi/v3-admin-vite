<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <el-card shadow="never">
          <el-input v-model="searchDeptName" placeholder="部门名称" clearable />
          <el-tree
            ref="deptTreeRef"
            class="mt-2"
            :data="deptList"
            :props="{ children: 'children', label: 'label', disabled: '' }"
            :expand-on-click-node="false"
            :filter-node-method="handleDeptFilter"
            default-expand-all
            @node-click="handleDeptNodeClick"
          />
        </el-card>
      </el-col>

      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户账号" prop="userName">
              <el-input v-model="queryParams.userName" clearable style="width: 200px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
              <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button v-hasPerm="['system:user:add']" :icon="Plus" type="success" @click="handleAdd('add')">新增</el-button>
              </div>
            </div>
          </template>

          <el-table v-loading="loading" :data="userList">
            <el-table-column label="账号" align="center" prop="userName" />
            <el-table-column label="用户名字" align="center" prop="userRealName" />
            <el-table-column label="性别" align="center" prop="userSex" :formatter="sexFormatter" />
            <el-table-column label="手机号码" align="center" prop="phone" />
            <el-table-column label="邮箱" align="center" prop="userEmail" />
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <el-switch v-model="scope.row.status" :inactive-value="'1'" :before-change="beforeSwitchChange" :active-value="'0'" @change="handleStatusChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="300">
              <template #default="scope">
                <el-button v-hasPerm="['system:user:reset']" :icon="Edit" type="primary" link size="small" @click="resetPassword(scope.row)">重置密码</el-button>
                <el-button v-hasPerm="['system:user:update']" :icon="Edit" type="primary" link size="small" @click="handleEdit('edit', scope.row)">编辑</el-button>
                <el-button v-hasPerm="['system:user:delete']" :icon="Delete" type="primary" link size="small" @click="handleDelete(scope.row.userId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
        </el-card>

        <UserDialog ref="userDialogRef" :deptList="deptList" :sexOption="sexOption" :statusOptions="statusOptions" :roleOptions="roleOptions" :initPassword="initPassword" @refresh="handleQuery()" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Search, Refresh, Plus, Delete, Edit } from "@element-plus/icons-vue"
import { reactive, ref, onMounted, nextTick, watchEffect } from "vue"
import { ElForm, ElMessageBox, ElMessage, ElTree } from "element-plus"
import { UserPageVO, UserQuery } from "@/api/user/types"
import { queryAllRoles } from "@/api/role"
import { RolePageVO } from "@/api/role/types"
import { getUserPage, changeUserStatus, delUserByUserId, resetUserPassword } from "@/api/user"
import { getDepartTreeSelect } from "@/api/dept"
import UserDialog from "@/views/system/user/dialog.vue"
import { getDict, selectDictLabel } from "@/api/dict"
import { getConfigByKey } from "@/api/config"
import { DictData } from "@/api/dict/types"
import pagination from "@/components/Pagination/index.vue"
// 部门树
const deptTreeRef = ref(ElTree)
// 查询表单
const queryFormRef = ref(ElForm)
const userDialogRef = ref()
const initPassword = ref()
const switchState = ref(false)
const total = ref(0)
const loading = ref(false)
const userList = ref<UserPageVO[]>([])
const searchDeptName = ref()
const deptList = ref<OptionType[]>([])
const sexOption = ref<Array<DictData>>([])
const statusOptions = ref<Array<DictData>>([])
const roleOptions = ref<Array<RolePageVO>>([])
const queryParams = reactive<UserQuery>({
  pageNum: 1,
  pageSize: 10
})

const beforeSwitchChange = () => {
  switchState.value = true
  return switchState.value
}

const sexFormatter = (row: UserPageVO) => {
  return selectDictLabel(sexOption.value, row.userSex)
}

watchEffect(
  () => {
    deptTreeRef.value.filter(searchDeptName.value)
  },
  {
    flush: "post"
  }
)

function handleQuery() {
  loading.value = true
  getUserPage(queryParams)
    .then(({ data }) => {
      userList.value = data.records
      total.value = data.total
    })
    .finally(() => {
      loading.value = false
    })
}

function handleStatusChange(row: UserPageVO) {
  if (switchState.value) {
    const text = row.status === "0" ? "启用" : "停用"
    ElMessageBox.confirm("确认要" + text + row.userName + "用户吗?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        return changeUserStatus(row.userId, row.status)
      })
      .then(() => {
        ElMessage.success(text + "成功")
      })
      .catch(() => {
        ElMessage.info("取消操作")
        row.status = row.status === "0" ? "1" : "0"
      })
  }
}

function resetPassword(row: UserPageVO) {
  ElMessageBox.prompt("请输入用户「" + row.userName + "」的新密码", "重置密码", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
    .then(({ value }) => {
      if (!value) {
        ElMessage.warning("请输入新密码")
        return false
      }
      resetUserPassword(row.userId, value).then(() => {
        ElMessage.success("密码重置成功，新密码是：" + value)
      })
    })
    .catch(() => {
      ElMessage.info("取消重置")
    })
}

function handleAdd(type: string) {
  userDialogRef.value.openDialog()
  nextTick(() => {
    userDialogRef.value.initData(type)
  })
}

function handleEdit(type: string, row: UserPageVO) {
  userDialogRef.value.openDialog()
  nextTick(() => {
    userDialogRef.value.initData(type, row)
  })
}

function handleDelete(userId: string) {
  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(function () {
      delUserByUserId(userId).then(() => {
        ElMessage.success("删除成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.pageNum = 1
  handleQuery()
}

const handleDeptFilter = (value: string, data: any) => {
  if (!value) {
    return true
  }
  return data.label.indexOf(value) !== -1
}
function handleDeptNodeClick(data: OptionType) {
  queryParams.deptId = data.id
  handleQuery()
}

function getDeptOptions() {
  getDepartTreeSelect().then(({ data }) => {
    deptList.value = data
  })
}

onMounted(() => {
  // 初始化部门
  getDeptOptions()
  // 初始化用户列表数据
  handleQuery()
  getDict("sys_user_sex").then(({ data }) => {
    sexOption.value = data
  })
  getDict("sys_status").then(({ data }) => {
    statusOptions.value = data
  })
  queryAllRoles().then(({ data }) => {
    roleOptions.value = data
  })
  getConfigByKey("initPassword").then(({ data }) => {
    initPassword.value = data
  })
})
</script>

<style scoped></style>
