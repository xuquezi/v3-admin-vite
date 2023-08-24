<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryParams.menuName" placeholder="菜单名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="Search" type="primary" @click="handleQuery"><template #icon />搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery"><template #icon />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" size="small">
      <template #header>
        <el-button v-hasPerm="['system:menu:add']" :icon="Plus" type="success" @click="handleAdd('add', '0')"> <template #icon />新增</el-button>
      </template>
      <el-table
        v-loading="loading"
        :data="menuList"
        highlight-current-row
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren'
        }"
        row-key="menuId"
        default-expand-all
        size="small"
      >
        <el-table-column label="菜单名称" min-width="200">
          <template #default="scope">
            <svg-icon :name="scope.row.menuType === MenuTypeEnum.BUTTON ? 'button' : scope.row.menuIcon" />
            {{ scope.row.menuName }}
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.menuType === MenuTypeEnum.CATALOG" type="warning">目录</el-tag>
            <el-tag v-if="scope.row.menuType === MenuTypeEnum.MENU" type="success">菜单</el-tag>
            <el-tag v-if="scope.row.menuType === MenuTypeEnum.BUTTON" type="danger">按钮</el-tag>
            <el-tag v-if="scope.row.menuType === MenuTypeEnum.EXTLINK" type="info">外链</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="路由路径" align="center" prop="menuPath" />
        <el-table-column label="组件路径" align="center" prop="menuComponent" />
        <el-table-column label="权限标识" align="center" prop="menuPerms" />
        <el-table-column label="显示状态" align="center" prop="menuVisible" :formatter="visibleFormatter" />
        <el-table-column label="排序" align="center" prop="menuOrderNum" />
        <el-table-column fixed="right" align="center" label="操作" width="300">
          <template #default="scope">
            <el-button
              v-hasPerm="['system:menu:add']"
              :icon="Plus"
              v-if="scope.row.menuType == MenuTypeEnum.CATALOG || scope.row.menuType === MenuTypeEnum.MENU"
              type="primary"
              link
              size="small"
              @click.stop="handleAdd('add', scope.row.menuId)"
            >
              新增
            </el-button>
            <el-button v-hasPerm="['system:menu:update']" :icon="Edit" type="primary" link size="small" @click.stop="handleEdit('edit', scope.row)">编辑</el-button>
            <el-button v-hasPerm="['system:menu:delete']" :icon="Delete" type="primary" link size="small" @click.stop="handleDelete(scope.row.menuId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <MenuDialog ref="menuDialogRef" :menuOptions="menuOptions" :visibleOptions="visibleOptions" @refresh="refreshData()" />
  </div>
</template>

<script setup lang="ts">
import { Search, Refresh, Plus, Delete, Edit } from "@element-plus/icons-vue"
import { MenuQuery, MenuData } from "@/api/menu/types"
import { getMenuList, getMenuTreeSelect, delMenuByMenuId } from "@/api/menu"
import { MenuTypeEnum } from "@/enums/MenuTypeEnum"
import MenuDialog from "@/views/system/menu/dialog.vue"
import { getDict, selectDictLabel } from "@/api/dict"
import { DictData } from "@/api/dict/types"
import { reactive, ref, onMounted, nextTick } from "vue"
import { ElForm, ElMessageBox, ElMessage } from "element-plus"

const visibleOptions = ref<Array<DictData>>([])
const menuList = ref<MenuData[]>([])
const menuOptions = ref<OptionType[]>([])
const queryParams = reactive<MenuQuery>({
  pageNum: 1,
  pageSize: 10
})
const queryFormRef = ref(ElForm)
const menuDialogRef = ref()
const loading = ref(false)
const visibleFormatter = (row: MenuData) => {
  return selectDictLabel(visibleOptions.value, row.menuVisible)
}

function handleQuery() {
  loading.value = true
  getMenuList(queryParams)
    .then(({ data }) => {
      menuList.value = data
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

function handleAdd(type: string, parentId: string) {
  menuDialogRef.value.openDialog()
  nextTick(() => {
    menuDialogRef.value.initData(type, parentId)
  })
}

function handleEdit(type: string, row: MenuData) {
  menuDialogRef.value.openDialog()
  nextTick(() => {
    menuDialogRef.value.initData(type, undefined, row)
  })
}

function handleDelete(menuId: string) {
  ElMessageBox.confirm("确定删除该菜单吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delMenuByMenuId(menuId).then(() => {
        ElMessage.success("删除成功")
        resetQuery()
      })
    })
    .catch(() => {
      ElMessage.info("取消操作")
    })
}

function refreshData() {
  handleQuery()
  // 初始化菜单数据
  getMenuOptions()
}

function getMenuOptions() {
  getMenuTreeSelect().then(({ data }) => {
    menuOptions.value = [{ id: "0", label: "顶级菜单", children: data }]
  })
}

onMounted(() => {
  handleQuery()
  // 初始化菜单数据
  getMenuOptions()
  getDict("sys_show_hide").then(({ data }) => {
    visibleOptions.value = data
  })
})
</script>

<style scoped></style>
