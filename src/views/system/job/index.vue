<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="jobName" label="任务名称">
          <el-input v-model="queryParams.jobName" placeholder="任务名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <el-button v-hasPerm="['system:job:add']" :icon="Plus" type="success" @click="handleAdd('add')">新增</el-button>
      </template>
      <el-table ref="dataTableRef" v-loading="loading" :data="jobList" highlight-current-row>
        <el-table-column label="任务名称" align="center" prop="jobName" />
        <el-table-column label="目标类" align="center" prop="invokeTarget" />
        <el-table-column label="目标方法" align="center" prop="invokeMethod" />
        <el-table-column label="目标参数" align="center" prop="invokeParam" />
        <el-table-column label="cron表达式" align="center" prop="cronExpression" />
        <el-table-column label="记录日志" align="center" prop="save_log" :formatter="saveLogFormatter" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-switch v-model="scope.row.status" :inactive-value="'1'" :before-change="beforeSwitchChange" :active-value="'0'" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button v-hasPerm="['system:job:update']" :icon="Edit" type="primary" size="small" link @click="handleUpdate('edit', scope.row)">编辑</el-button>
            <el-button v-hasPerm="['system:job:delete']" :icon="Delete" type="primary" size="small" link @click="handleDelete(scope.row.jobId)">删除</el-button>
            <el-button v-hasPerm="['system:job:run']" :icon="Position" type="primary" size="small" link @click="handleRun(scope.row.jobId)">执行一次</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>
    <JobDialog ref="jobDialogRef" @refresh="handleQuery()" :policyOptions="policyOptions" :concurrentOptions="concurrentOptions" :statusOptions="statusOptions" :saveLogOptions="saveLogOptions" />
  </div>
</template>

<script setup lang="ts">
import { Search, Refresh, Plus, Delete, Edit, Position } from "@element-plus/icons-vue"
import { reactive, ref, onMounted } from "vue"
import { ElForm, ElMessageBox, ElMessage } from "element-plus"
import { JobQuery, JobData } from "@/api/job/types"
import { getJobPage, changeJobStatus, delJobById, runJob } from "@/api/job"
import { getDict, selectDictLabel } from "@/api/dict"
import { DictData } from "@/api/dict/types"
import JobDialog from "@/views/system/job/dialog.vue"
import pagination from "@/components/Pagination/index.vue"
const queryFormRef = ref(ElForm)
const queryParams = reactive<JobQuery>({
  pageNum: 1,
  pageSize: 10
})
const jobDialogRef = ref()
const statusOptions = ref<Array<DictData>>([])
const policyOptions = ref<Array<DictData>>([])
const concurrentOptions = ref<Array<DictData>>([])
const saveLogOptions = ref<Array<DictData>>([])
const loading = ref(false)
const total = ref(0)
const jobList = ref<JobData[]>([])
const switchState = ref(false)

const beforeSwitchChange = () => {
  switchState.value = true
  return switchState.value
}

const saveLogFormatter = (row: JobData) => {
  return selectDictLabel(saveLogOptions.value, row.saveLog)
}

function handleQuery() {
  loading.value = true
  getJobPage(queryParams)
    .then(({ data }) => {
      jobList.value = data.records
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

function handleStatusChange(row: JobData) {
  if (switchState.value) {
    const text = row.status === "0" ? "启用" : "停用"
    ElMessageBox.confirm("确认要" + text + row.jobName + "定时任务吗?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        return changeJobStatus(row.jobId, row.status)
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

function handleAdd(type: string) {
  jobDialogRef.value.openDialog(type)
}

function handleUpdate(type: string, row: JobData) {
  jobDialogRef.value.openDialog(type, row)
}

function handleRun(jobId: string) {
  ElMessageBox.confirm("确定执行一次该定时任务吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      runJob(jobId).then(() => {
        ElMessage.success("执行成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

function handleDelete(jobId: string) {
  ElMessageBox.confirm("确定删除该定时任务吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delJobById(jobId).then(() => {
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
  getDict("sys_status").then(({ data }) => {
    statusOptions.value = data
  })
  getDict("error_policy").then(({ data }) => {
    policyOptions.value = data
  })
  getDict("concurrent").then(({ data }) => {
    concurrentOptions.value = data
  })
  getDict("save_log").then(({ data }) => {
    saveLogOptions.value = data
  })
})
</script>

<style scoped></style>
