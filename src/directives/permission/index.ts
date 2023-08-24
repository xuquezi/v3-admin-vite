import { Directive, DirectiveBinding } from "vue"
import { useUserStoreHook } from "@/store/modules/user"

/**
 * 按钮权限
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { perms } = useUserStoreHook()
    const { value } = binding
    if (value) {
      const requiredPerms = value // DOM绑定需要的按钮权限标识

      const hasPerm = perms?.some((perm) => {
        return requiredPerms.includes(perm)
      })

      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error("need perms! Like v-has-perm=\"['sys:user:add','sys:user:edit']\"")
    }
  }
}

/**
 * 角色权限
 */
export const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    if (value) {
      const requiredRoles = value // DOM绑定需要的角色编码
      const { roles } = useUserStoreHook()
      const hasRole = roles.some((perm) => {
        return requiredRoles.includes(perm)
      })

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error("need roles! Like v-has-role=\"['admin','test']\"")
    }
  }
}
