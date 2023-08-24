<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="queryParams.roleName" placeholder="角色名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <el-button v-hasPerm="['system:role:add']" :icon="Plus" type="success" @click="handleAdd('add')">新增</el-button>
      </template>
      <el-table ref="dataTableRef" v-loading="loading" :data="roleList" highlight-current-row>
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="角色编码" align="center" prop="roleKey" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-switch v-model="scope.row.status" :inactive-value="'1'" :before-change="beforeSwitchChange" :active-value="'0'" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button v-hasPerm="['system:role:auth']" :icon="Edit" type="primary" size="small" link @click="openMenuDialog(scope.row)">分配权限</el-button>
            <el-button v-hasPerm="['system:role:update']" :icon="Edit" type="primary" size="small" link @click="handleUpdate('edit', scope.row)">编辑</el-button>
            <el-button v-hasPerm="['system:role:delete']" :icon="Delete" type="primary" size="small" link @click="handleDelete(scope.row.roleId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>
    <RoleDialog ref="roleDialogRef" :statusOptions="statusOptions" :dataScopeOptions="dataScopeOptions" @refresh="handleQuery()" />
    <RoleAuth ref="roleAuthRef" :menuList="menuList" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, nextTick } from "vue"
import { ElForm, ElMessageBox, ElMessage } from "element-plus"
import { RoleQuery, RolePageVO } from "@/api/role/types"
import { getRolePage, delRoleByRoleId, changeRoleStatus } from "@/api/role"
import { getMenuTreeSelect } from "@/api/menu"
import { Search, Refresh, Plus, Delete, Edit } from "@element-plus/icons-vue"
import RoleDialog from "@/views/system/role/dialog.vue"
import RoleAuth from "@/views/system/role/auth.vue"
import { getDict } from "@/api/dict"
import { DictData } from "@/api/dict/types"
import pagination from "@/components/Pagination/index.vue"

const statusOptions = ref<Array<DictData>>([])
const dataScopeOptions = ref<Array<DictData>>([])
const loading = ref(false)
const queryFormRef = ref(ElForm)
const queryParams = reactive<RoleQuery>({
  pageNum: 1,
  pageSize: 10
})
const menuList = ref<OptionType[]>([])
const roleDialogRef = ref()
const roleAuthRef = ref()
const total = ref(0)
const roleList = ref<RolePageVO[]>()
const switchState = ref(false)
const beforeSwitchChange = () => {
  switchState.value = true
  return switchState.value
}

/**
 * 查询
 */
function handleQuery() {
  loading.value = true
  getRolePage(queryParams)
    .then(({ data }) => {
      roleList.value = data.records
      total.value = data.total
    })
    .finally(() => {
      loading.value = false
    })
}

function handleStatusChange(row: RolePageVO) {
  if (switchState.value) {
    const text = row.status === "0" ? "启用" : "停用"
    ElMessageBox.confirm("确认要" + text + row.roleName + "角色吗?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        return changeRoleStatus(row.roleId, row.status)
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

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.pageNum = 1
  handleQuery()
}

function handleAdd(type: string) {
  roleDialogRef.value.openDialog(type)
}

function handleUpdate(type: string, row: RolePageVO) {
  roleDialogRef.value.openDialog(type, row)
}

function handleDelete(roleId: string) {
  ElMessageBox.confirm("确定删除该角色吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delRoleByRoleId(roleId).then(() => {
        ElMessage.success("删除成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

function getMenuOptions() {
  getMenuTreeSelect().then(({ data }) => {
    menuList.value = data
  })
}

function openMenuDialog(row: RolePageVO) {
  roleAuthRef.value.openMenuDialog()
  nextTick(() => {
    roleAuthRef.value.initData(row.roleId, row.roleName)
  })
}

onMounted(() => {
  handleQuery()
  // 初始化菜单数据
  getMenuOptions()
  getDict("sys_status").then(({ data }) => {
    statusOptions.value = data
  })
  getDict("data_scope").then(({ data }) => {
    dataScopeOptions.value = data
  })
})
</script>

<style scoped></style>
