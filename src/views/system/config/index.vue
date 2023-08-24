<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="configName" label="配置名称">
          <el-input v-model="queryParams.configName" placeholder="配置名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <el-button v-hasPerm="['system:config:add']" :icon="Plus" type="success" @click="handleAdd('add')">新增</el-button>
      </template>
      <el-table ref="dataTableRef" v-loading="loading" :data="configList" highlight-current-row>
        <el-table-column label="配置名称" align="center" prop="configName" />
        <el-table-column label="配置key" align="center" prop="configKey" />
        <el-table-column label="配置值" align="center" prop="configValue" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button v-hasPerm="['system:config:update']" :icon="Edit" type="primary" size="small" link @click="handleUpdate('edit', scope.row)">编辑</el-button>
            <el-button v-hasPerm="['system:config:delete']" :icon="Delete" type="primary" size="small" link @click="handleDelete(scope.row.configId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>
    <ConfigDialog ref="configDialogRef" @refresh="handleQuery()" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"
import { ElForm, ElMessageBox, ElMessage } from "element-plus"
import { ConfigQuery, ConfigData } from "@/api/config/types"
import { getConfigPage, delConfigById } from "@/api/config"
import ConfigDialog from "@/views/system/config/dialog.vue"
import { Search, Refresh, Plus, Delete, Edit } from "@element-plus/icons-vue"
import pagination from "@/components/Pagination/index.vue"
const configDialogRef = ref()
const queryParams = reactive<ConfigQuery>({
  pageNum: 1,
  pageSize: 10
})
const queryFormRef = ref(ElForm)
const total = ref(0)
const loading = ref(false)
const configList = ref<ConfigData[]>([])

function handleQuery() {
  loading.value = true
  getConfigPage(queryParams)
    .then(({ data }) => {
      configList.value = data.records
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

function handleUpdate(type: string, row: ConfigData) {
  configDialogRef.value.openDialog(type, row)
}

function handleAdd(type: string) {
  configDialogRef.value.openDialog(type)
}

function handleDelete(configId: string) {
  ElMessageBox.confirm("确定删除该配置项吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delConfigById(configId).then(() => {
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
