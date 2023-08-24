<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="queryParams.username" placeholder="用户名" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <el-button v-hasPerm="['system:operateLog:delete']" :icon="Delete" type="success" :disabled="multiple" @click="handleDeleteSelect()">删除</el-button>
        <el-button v-hasPerm="['system:operateLog:clear']" :icon="Delete" type="success" @click="handleClear()">清空</el-button>
      </template>
      <el-table ref="dataTableRef" v-loading="loading" :data="logList" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="ip" align="center" prop="ip" />
        <el-table-column label="用户名" align="center" prop="username" />
        <el-table-column label="url" align="center" prop="url" />
        <el-table-column label="访问时间" align="center" prop="visitTime" />
        <el-table-column label="访问方法" align="center" prop="method" />
        <el-table-column label="耗时(毫秒)" align="center" prop="executionTime" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button v-hasPerm="['system:operateLog:delete']" :icon="Delete" type="primary" size="small" link @click="handleDelete(scope.row.logId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"
import { ElForm, ElMessageBox, ElMessage } from "element-plus"
import { OperateLogQuery, OperateLogData } from "@/api/operateLog/types"
import { getOperateLogPage, delLogByLogId, deleteSelectedLog, clearLog } from "@/api/operateLog"
import { Delete } from "@element-plus/icons-vue"
import pagination from "@/components/Pagination/index.vue"

const queryParams = reactive<OperateLogQuery>({
  pageNum: 1,
  pageSize: 10
})

const loading = ref(false)
const total = ref(0)
const logList = ref<OperateLogData[]>()
const queryFormRef = ref(ElForm)
const ids = ref<string[]>([])
const multiple = ref(true)

function handleSelectionChange(selection: OperateLogData[]) {
  ids.value = selection.map((item: OperateLogData) => item.logId)
  multiple.value = !selection.length
}
function resetQuery() {
  queryFormRef.value.resetFields()
  queryParams.pageNum = 1
  handleQuery()
}

function handleDelete(logId: string) {
  ElMessageBox.confirm("确定删除该日志吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delLogByLogId(logId).then(() => {
        ElMessage.success("删除成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

function handleDeleteSelect() {
  ElMessageBox.confirm("确定删除选中的记录吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteSelectedLog(ids.value).then(() => {
        ElMessage.success("删除成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

function handleClear() {
  ElMessageBox.confirm("确定清空所有日志吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      clearLog().then(() => {
        ElMessage.success("清空成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

function handleQuery() {
  loading.value = true
  getOperateLogPage(queryParams)
    .then(({ data }) => {
      logList.value = data.records
      total.value = data.total
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  handleQuery()
})
</script>

<style scoped></style>
