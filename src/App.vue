<template>
  <div class="app" v-cloak>
    <router-view v-slot="{ Component }">
      <transition name="router-fade" mode="out-in">
        <keep-alive :include="$store.state.keepAliveComponent">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>

    <el-backtop></el-backtop>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
/* 动画过程 */
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.2s ease-in;
}
/* 动画起止 */
.router-fade-enter-from,
.router-fade-leave-to {
  opacity: 0;
}
</style>
