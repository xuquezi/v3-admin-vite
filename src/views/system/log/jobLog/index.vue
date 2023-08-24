<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="jobName" label="任务名称">
          <el-input v-model="queryParams.jobName" placeholder="任务名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <el-button v-hasPerm="['system:jobLog:delete']" :icon="Delete" type="success" :disabled="multiple" @click="handleDeleteSelect()">删除</el-button>
        <el-button v-hasPerm="['system:jobLog:clear']" :icon="Delete" type="success" @click="handleClear()">清空</el-button>
      </template>
      <el-table ref="dataTableRef" v-loading="loading" :data="logList" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="任务名称" align="center" prop="jobName" />
        <el-table-column label="目标类" align="center" prop="invokeTarget" />
        <el-table-column label="目标方法" align="center" prop="invokeMethod" />
        <el-table-column label="目标参数" align="center" prop="invokeParam" />
        <el-table-column label="开始时间" align="center" prop="startTime" />
        <el-table-column label="结束时间" align="center" prop="endTime" />
        <el-table-column label="状态" align="center" prop="status" :formatter="statusFormatter" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button v-hasPerm="['system:jobLog:delete']" :icon="Delete" type="primary" size="small" link @click="handleDelete(scope.row.jobLogId)">删除</el-button>
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
import { JobLogQuery, JobLogData } from "@/api/joblog/types"
import { queryJobLogByPage, delLogByLogId, deleteSelectedLog, clearLog } from "@/api/joblog"
import { getDict, selectDictLabel } from "@/api/dict"
import { DictData } from "@/api/dict/types"
import { Delete } from "@element-plus/icons-vue"
import pagination from "@/components/Pagination/index.vue"
const queryParams = reactive<JobLogQuery>({
  pageNum: 1,
  pageSize: 10
})
const statusOptions = ref<Array<DictData>>([])
const logList = ref<JobLogData[]>()
const multiple = ref(true)
const total = ref(0)
const loading = ref(false)
const queryFormRef = ref(ElForm)
const ids = ref<string[]>([])

const statusFormatter = (row: JobLogData) => {
  return selectDictLabel(statusOptions.value, row.status)
}
function handleQuery() {
  loading.value = true
  queryJobLogByPage(queryParams)
    .then(({ data }) => {
      logList.value = data.records
      total.value = data.total
    })
    .finally(() => {
      loading.value = false
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

function handleSelectionChange(selection: JobLogData[]) {
  ids.value = selection.map((item: JobLogData) => item.jobLogId)
  multiple.value = !selection.length
}

function handleDelete(jobLogId: string) {
  ElMessageBox.confirm("确定删除该日志吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delLogByLogId(jobLogId).then(() => {
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

onMounted(() => {
  handleQuery()
  getDict("success_status").then(({ data }) => {
    statusOptions.value = data
  })
})
</script>

<style scoped></style>
