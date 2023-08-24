<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="queryParams.deptName" placeholder="部门名称" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" class="filter-item" type="primary" @click="handleQuery"> 搜索 </el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card>
      <template #header>
        <el-button v-hasPerm="['system:dept:add']" :icon="Plus" type="success" @click="handleAdd('add', '0')">新增</el-button>
      </template>

      <el-table v-loading="loading" :data="deptList" row-key="deptId" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="deptName" label="部门名称" align="center" />
        <el-table-column prop="orderNum" label="排序" align="center" />
        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="scope">
            <el-button v-hasPerm="['system:dept:add']" :icon="Plus" type="primary" link size="small" @click.stop="handleAdd('add', scope.row.deptId)">新增 </el-button>
            <el-button v-hasPerm="['system:dept:update']" :icon="Edit" type="primary" link size="small" @click.stop="handleEdit('edit', scope.row)">编辑 </el-button>
            <el-button v-hasPerm="['system:dept:delete']" :icon="Delete" type="primary" link size="small" @click.stop="handleDelete(scope.row.deptId)">删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <DeptDialog ref="deptDialogRef" :deptOptions="deptOptions" @refresh="refreshData()" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"
import { ElForm, ElMessageBox, ElMessage } from "element-plus"
import { DeptQuery, DeptData } from "@/api/dept/types"
import { getDeptList, getDepartTreeSelect, delDeptById } from "@/api/dept"
import DeptDialog from "@/views/system/dept/dialog.vue"
import { Search, Refresh, Plus, Delete, Edit } from "@element-plus/icons-vue"
const queryParams = reactive<DeptQuery>({
  pageNum: 1,
  pageSize: 10
})
const loading = ref(false)
const deptList = ref<DeptData[]>([])
const queryFormRef = ref(ElForm)
const deptOptions = ref<OptionType[]>([])
const deptDialogRef = ref()
function handleQuery() {
  loading.value = true
  getDeptList(queryParams)
    .then(({ data }) => {
      deptList.value = data
    })
    .finally(() => {
      loading.value = false
    })
}

function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.pageNum = 1
  handleQuery()
}

function handleDelete(deptId: string) {
  ElMessageBox.confirm("确定删除该部门吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delDeptById(deptId).then(() => {
        ElMessage.success("删除成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

function handleAdd(type: string, parentId: string) {
  deptDialogRef.value.openDialog(type, parentId)
}

function handleEdit(type: string, row: DeptData) {
  deptDialogRef.value.openDialog(type, undefined, row)
}

function getDeptOptions() {
  getDepartTreeSelect().then(({ data }) => {
    deptOptions.value = [{ id: "0", label: "顶级部门", children: data }]
  })
}

function refreshData() {
  handleQuery()
  getDeptOptions()
}

onMounted(() => {
  handleQuery()
  getDeptOptions()
})
</script>

<style scoped></style>
