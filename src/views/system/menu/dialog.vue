<template>
  <div>
    <el-dialog v-model="dialog.isShowDialog" :title="dialog.title" append-to-body width="800px" @close="closeDialog">
      <el-form ref="menuFormRef" :model="formData" :rules="menuRules" label-width="100px">
        <el-form-item label="父级菜单" prop="menuParentId">
          <el-tree-select node-key="id" v-model="formData.menuParentId" placeholder="选择上级菜单" :data="menuOptions" filterable check-strictly />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="formData.menuType" @change="onMenuTypeChange">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮</el-radio>
            <el-radio label="L">外链</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.menuType == MenuTypeEnum.EXTLINK" label="外链地址" prop="menuPath">
          <el-input v-model="formData.menuPath" placeholder="请输入外链完整路径" />
        </el-form-item>

        <el-form-item v-if="formData.menuType == MenuTypeEnum.CATALOG || formData.menuType == MenuTypeEnum.MENU" label="路由路径" prop="menuPath">
          <el-input v-if="formData.menuType == MenuTypeEnum.CATALOG" v-model="formData.menuPath" placeholder="请输入路由" />
          <el-input v-else v-model="formData.menuPath" placeholder="请输入路由" />
        </el-form-item>

        <!-- 组件页面完整路径 -->
        <el-form-item v-if="formData.menuType == MenuTypeEnum.MENU" label="页面路径" prop="menuComponent">
          <el-input v-model="formData.menuComponent" placeholder="请输入页面路径" style="width: 95%">
            <template v-if="formData.menuType == MenuTypeEnum.MENU" #prepend>src/views/</template>
            <template v-if="formData.menuType == MenuTypeEnum.MENU" #append>.vue</template>
          </el-input>
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item v-if="formData.menuType == MenuTypeEnum.BUTTON" label="权限标识" prop="menuPerms">
          <el-input v-model="formData.menuPerms" placeholder="请输入权限标识" />
        </el-form-item>

        <el-form-item v-if="formData.menuType !== MenuTypeEnum.BUTTON" label="图标" prop="menuIcon">
          <!-- 图标选择器 -->
          <icon-select v-model="formData.menuIcon" />
        </el-form-item>

        <el-form-item v-if="formData.menuType == MenuTypeEnum.CATALOG" label="跳转路由">
          <el-input v-model="formData.redirect" placeholder="请输入跳转路由" />
        </el-form-item>

        <el-form-item v-if="formData.menuType !== MenuTypeEnum.BUTTON" label="显示状态">
          <el-radio-group v-model="formData.menuVisible">
            <el-radio v-for="dict in visibleOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="menuOrderNum">
          <el-input-number v-model="formData.menuOrderNum" style="width: 100px" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElForm, ElMessage } from "element-plus"
import { MenuForm, MenuData } from "@/api/menu/types"
import { MenuTypeEnum } from "@/enums/MenuTypeEnum"
import { menuRules } from "./validate"
import IconSelect from "@/components/IconSelect/index.vue"
import { DictData } from "@/api/dict/types"
import { updateMenu, addMenu } from "@/api/menu"
import { useThrottleFn } from "@vueuse/core"
defineProps({
  menuOptions: {
    type: Array<OptionType>,
    default: []
  },
  visibleOptions: {
    type: Array<DictData>,
    default: []
  }
})
const dialog = reactive({
  isShowDialog: false,
  title: ""
})
const menuCacheData = reactive({
  type: "",
  path: ""
})
const emit = defineEmits(["refresh"])
const loading = ref(false)
const menuFormRef = ref(ElForm)
const formData = reactive<MenuForm>({
  menuParentId: "0",
  menuVisible: "0",
  menuOrderNum: 0,
  menuType: MenuTypeEnum.MENU,
  menuId: "",
  menuComponent: "",
  menuIcon: "",
  menuName: "",
  menuPath: "",
  menuPerms: ""
})
function closeDialog() {
  dialog.isShowDialog = false
}

/**
 * 重置表单
 */
function resetForm() {
  formData.menuParentId = "0"
  formData.menuVisible = "0"
  formData.menuOrderNum = 0
  formData.menuType = MenuTypeEnum.MENU
  formData.menuId = ""
  formData.menuComponent = ""
  formData.menuIcon = ""
  formData.menuName = ""
  formData.menuPath = ""
  formData.menuPerms = ""
}

/**
 * 菜单类型 change
 */
function onMenuTypeChange() {
  // 如果菜单类型改变，清空路由路径；未改变在切换后还原路由路径
  if (formData.menuType !== menuCacheData.type) {
    formData.menuPath = ""
  } else {
    formData.menuPath = menuCacheData.path
  }
}
function openDialog() {
  dialog.isShowDialog = true
}

function initData(type: string, parentId: string, row: MenuData) {
  resetForm()
  if (type === "edit") {
    dialog.title = "修改菜单"
    Object.assign(formData, row)
    menuCacheData.type = row.menuType
    menuCacheData.path = row.menuPath ?? ""
  } else {
    dialog.title = "新增菜单"
    formData.menuParentId = parentId
  }
}

const handleSubmit = useThrottleFn(() => {
  menuFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const menuId = formData.menuId
      loading.value = true
      if (menuId) {
        updateMenu(formData)
          .then(() => {
            ElMessage.success("修改成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      } else {
        addMenu(formData)
          .then(() => {
            ElMessage.success("新增成功")
            closeDialog()
            emit("refresh")
          })
          .finally(() => (loading.value = false))
      }
    }
  })
}, 3000)

defineExpose({
  openDialog,
  initData
})
</script>

<style scoped></style>
