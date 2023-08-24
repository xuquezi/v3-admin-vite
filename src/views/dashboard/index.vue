<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎: {{ userStore.userRealName }}</div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user"

const userStore = useUserStore()
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
