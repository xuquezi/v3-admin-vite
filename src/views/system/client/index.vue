<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="clientName" label="客户端名称">
          <el-input v-model="queryParams.clientName" placeholder="客户端名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <el-button v-hasPerm="['system:client:add']" :icon="Plus" type="success" @click="handleAdd('add')">新增</el-button>
      </template>
      <el-table ref="dataTableRef" v-loading="loading" :data="clientList" highlight-current-row>
        <el-table-column label="客户端名称" align="center" prop="clientName" />
        <el-table-column label="客户端Key" align="center" prop="clientKey" />
        <el-table-column label="客户端Secret" align="center" prop="clientSecret" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button v-hasPerm="['system:client:update']" :icon="Delete" type="primary" size="small" link @click="handleUpdate('edit', scope.row)"> 编辑</el-button>
            <el-button v-hasPerm="['system:client:delete']" :icon="Edit" type="primary" size="small" link @click="handleDelete(scope.row.clientId)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>
    <ClientDialog ref="clientDialogRef" @refresh="handleQuery()" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"
import { ElForm, ElMessageBox, ElMessage } from "element-plus"
import { ClientQuery, ClientData } from "@/api/client/types"
import { getClientPage, delClientById } from "@/api/client"
import ClientDialog from "@/views/system/client/dialog.vue"
import { Search, Refresh, Plus, Delete, Edit } from "@element-plus/icons-vue"
import pagination from "@/components/Pagination/index.vue"
const queryParams = reactive<ClientQuery>({
  pageNum: 1,
  pageSize: 10
})
const loading = ref(false)
const clientList = ref<ClientData[]>([])
const total = ref(0)
const queryFormRef = ref(ElForm)
const clientDialogRef = ref()
function handleQuery() {
  loading.value = true
  getClientPage(queryParams)
    .then(({ data }) => {
      clientList.value = data.records
      total.value = data.total
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

function handleAdd(type: string) {
  clientDialogRef.value.openDialog(type)
}

function handleUpdate(type: string, row: ClientData) {
  clientDialogRef.value.openDialog(type, row)
}

function handleDelete(clientId: string) {
  ElMessageBox.confirm("确定删除该客户端吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delClientById(clientId).then(() => {
        ElMessage.success("删除成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

onMounted(() => {
  handleQuery()
})
</script>

<style scoped></style>
