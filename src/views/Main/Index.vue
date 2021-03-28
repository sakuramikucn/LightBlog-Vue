<template>
  <div>
    <!-- 内容 -->
    <el-row type="flex" justify="center" class="main">
      <el-col :xs="24" :sm="20" :md="11">
        <article-list />
      </el-col>
      <!-- 侧边栏 -->
      <el-col hidden-sm-only :md="5">
        <side-bar />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ArticleList from "components/Main/ArticleList";
import SideBar from "components/Main/SideBar";

export default {
  name: "Main",
  components: {
    ArticleList,
    SideBar,
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-color: var(--color-bg);
  min-height: 85vh;
}
</style>