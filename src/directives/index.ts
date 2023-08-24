import { type App } from "vue"
import { hasPerm } from "./permission"

/** 挂载自定义指令 */
export function loadDirectives(app: App) {
  // 使 v-hasPerm 在所有组件中都可用
  app.directive("hasPerm", hasPerm)
}
