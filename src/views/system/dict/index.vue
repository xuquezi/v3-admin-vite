<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="dictName" label="字典名称">
          <el-input v-model="queryParams.dictName" placeholder="字典名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <template #header>
        <el-button v-hasPerm="['system:dict:add']" :icon="Plus" type="success" @click="handleAdd('add')">新增</el-button>
      </template>
      <el-table ref="dataTableRef" v-loading="loading" :data="dictList" highlight-current-row>
        <el-table-column label="字典名称" align="center" prop="dictName" />
        <el-table-column label="字典内容" align="center" prop="dictLabel" />
        <el-table-column label="字典值" align="center" prop="dictValue" />
        <el-table-column label="字典类型" align="center" prop="dictType" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button v-hasPerm="['system:dict:update']" :icon="Edit" type="primary" size="small" link @click="handleUpdate('edit', scope.row)">编辑</el-button>
            <el-button v-hasPerm="['system:dict:delete']" :icon="Delete" type="primary" size="small" link @click="handleDelete(scope.row.dictCode)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>
    <DcitDialog ref="dictDialogRef" @refresh="handleQuery()" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"
import { ElForm, ElMessageBox, ElMessage } from "element-plus"
import { DictQuery, DictData } from "@/api/dict/types"
import { getDictPage, delDictByDictCode } from "@/api/dict"
import DcitDialog from "@/views/system/dict/dialog.vue"
import { Search, Refresh, Plus, Delete, Edit } from "@element-plus/icons-vue"
import pagination from "@/components/Pagination/index.vue"
const dictDialogRef = ref()
const queryParams = reactive<DictQuery>({
  pageNum: 1,
  pageSize: 10
})
const queryFormRef = ref(ElForm)
const total = ref(0)
const loading = ref(false)
const dictList = ref<DictData[]>()

function handleQuery() {
  loading.value = true
  getDictPage(queryParams)
    .then(({ data }) => {
      dictList.value = data.records
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

function handleUpdate(type: string, row: DictData) {
  dictDialogRef.value.openDialog(type, row)
}

function handleAdd(type: string) {
  dictDialogRef.value.openDialog(type)
}

function handleDelete(dictCode: string) {
  ElMessageBox.confirm("确定删除该字典项吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delDictByDictCode(dictCode).then(() => {
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
