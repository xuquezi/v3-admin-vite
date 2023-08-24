<template>
  <div>
    <el-dialog v-model="menuDialogVisible" :title="'【' + checkRoleName + '】权限分配'" width="800px">
      <el-scrollbar v-loading="loading" max-height="800px">
        <el-tree ref="menuRef" node-key="id" show-checkbox :data="menuList" :default-expand-all="true">
          <template #default="{ data }">
            {{ data.label }}
          </template>
        </el-tree>
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleRoleMenuSubmit">确 定</el-button>
          <el-button @click="menuDialogVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElTree, ElMessage } from "element-plus"
import { getRoleMenuCheckedIds } from "@/api/menu"
import { updateRoleMenus } from "@/api/role"
defineProps({
  menuList: {
    type: Array<OptionType>,
    default: []
  }
})
const menuDialogVisible = ref(false)
const loading = ref(false)
const checkRoleName = ref()
const checkRoleId = ref()
const menuRef = ref(ElTree)

function initData(roleId: string, roleName: string) {
  loading.value = true
  checkRoleName.value = roleName
  checkRoleId.value = roleId
  // 回显角色已拥有的菜单
  menuRef.value.setCheckedKeys([])
  getRoleMenuCheckedIds(roleId)
    .then(({ data }) => {
      const checkedMenuIds = data
      checkedMenuIds.forEach((menuId) => menuRef.value.setChecked(menuId, true, false))
    })
    .finally(() => {
      loading.value = false
    })
}

function openMenuDialog() {
  menuDialogVisible.value = true
}

function handleRoleMenuSubmit() {
  if (checkRoleId.value) {
    const checkedMenuIds: string[] = menuRef.value.getCheckedNodes(false, true).map((node: OptionType) => node.id)
    loading.value = true
    updateRoleMenus(checkRoleId.value, checkedMenuIds)
      .then(() => {
        ElMessage.success("分配权限成功")
        menuDialogVisible.value = false
      })
      .finally(() => {
        loading.value = false
      })
  }
}
defineExpose({
  openMenuDialog,
  initData
})
</script>

<style scoped></style>
