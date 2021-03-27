<template>
  <div class="side-bar-container">
    <!-- 个人简介 -->
    <el-row type="flex" justify="center">
      <el-col>
        <me-info/>
      </el-col>
    </el-row>

    <!-- 最热文章 -->
    <el-row type="flex" justify="center">
      <el-col>
        <sort-list></sort-list>
      </el-col>
    </el-row>

    <!-- 最热分类-->
    <el-row type="flex" justify="center">
      <el-col>
        <sort-list></sort-list>
      </el-col>
    </el-row>

    <!-- 最热标签-->
    <el-row type="flex" justify="center">
      <el-col>
        <sort-list></sort-list>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import MeInfo from 'components/Main/MeInfo'
import SortList from './SortList.vue';

export default {
  name: "SideBar",
  components: {
    MeInfo,
    SortList
  }
};
</script>

<style lang="scss" scoped>
.side-bar-container {
  margin: 30px 0;
  min-height: 40vh;
}
</style>